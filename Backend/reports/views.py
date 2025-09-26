from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Report
from .serializers import ReportSerializer
from .utils import process_report_text
from deep_translator import GoogleTranslator


@api_view(["POST"])
def process_report(request):
    text = request.data.get("report", "")
    if not text:
        return Response({"error": "Report text is required"}, status=status.HTTP_400_BAD_REQUEST)

    data = process_report_text(text)

    report = Report.objects.create(
        original=text,
        drug=data["drug"],
        adverse_events=",".join(data["adverse_events"]),
        severity=data["severity"],
        outcome=data["outcome"],
    )

    return Response(ReportSerializer(report).data)


@api_view(["GET"])
def list_reports(request):
    reports = Report.objects.all().order_by("-created_at")
    return Response(ReportSerializer(reports, many=True).data)


@api_view(["POST"])
def translate_outcome(request):
    text = request.data.get("outcome", "")
    target_lang = request.data.get("lang", "es")  # default Spanish

    if not text:
        return Response({"error": "Outcome text is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        translated = GoogleTranslator(source="auto", target=target_lang).translate(text)
        return Response({"original": text, "translated": translated, "lang": target_lang})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
