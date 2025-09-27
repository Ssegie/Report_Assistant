from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Report
from .serializers import ReportSerializer
from .utils import process_report_text
from deep_translator import GoogleTranslator
import PyPDF2


@api_view(["POST"])
def process_report(request):
    """
    Accepts either:
    1. Structured form data (drug, adverse_events, severity, outcome, optional file)
    2. Raw text report + optional file
    """

    # Structured fields
    drug = request.data.get("drug")
    adverse_events = request.data.get("adverse_events")
    severity = request.data.get("severity")
    outcome = request.data.get("outcome")

    # Optional uploaded file
    uploaded_file = request.FILES.get("file")
    text = request.data.get("report", "")

    # Extract text from file if uploaded
    if uploaded_file:
        try:
            if uploaded_file.content_type == "text/plain":
                text = uploaded_file.read().decode("utf-8")
            elif uploaded_file.content_type == "application/pdf":
                reader = PyPDF2.PdfReader(uploaded_file)
                text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            else:
                return Response(
                    {"error": "Unsupported file type"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            return Response(
                {"error": f"Failed to read file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Normalize adverse_events to a list
    if isinstance(adverse_events, str):
        adverse_events_list = [e.strip() for e in adverse_events.split(",") if e.strip()]
    elif isinstance(adverse_events, list):
        adverse_events_list = adverse_events
    else:
        adverse_events_list = []

    # Case 1: Structured form data
    if drug and adverse_events_list and severity and outcome:
        report = Report.objects.create(
            original=text or "Submitted via form",
            drug=drug,
            adverse_events=",".join(adverse_events_list),
            severity=severity,
            outcome=outcome,
            file=uploaded_file if uploaded_file else None,
        )
        return Response(ReportSerializer(report).data)

    # Case 2: Only text (from file or manual input)
    if text.strip():
        data = process_report_text(text)
        report = Report.objects.create(
            original=text,
            drug=data.get("drug", ""),
            adverse_events=",".join(data.get("adverse_events", [])),
            severity=data.get("severity", ""),
            outcome=data.get("outcome", ""),
            file=uploaded_file if uploaded_file else None,
        )
        return Response(ReportSerializer(report).data)

    return Response({"error": "Invalid submission"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_reports(request):
    reports = Report.objects.all().order_by("-created_at")
    return Response(ReportSerializer(reports, many=True).data)


@api_view(["POST"])
def translate_outcome(request):
    # Accept either 'outcome' or 'text' key from frontend
    text = request.data.get("outcome") or request.data.get("text")
    target_lang = request.data.get("lang", "es")  # default Spanish

    if not text:
        return Response(
            {"error": "Outcome text is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return Response(
            {"original": text, "translated": translated, "lang": target_lang}
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
