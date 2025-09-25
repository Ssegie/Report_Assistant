from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Report
from .serializers import ReportSerializer
from .utils import extract_drug, extract_adverse_events, detect_severity, detect_outcome

@api_view(["POST"])
def process_report(request):
    text = request.data.get("report", "")
    if not text:
        return Response({"error": "Empty report"}, status=400)

    drug = extract_drug(text)
    events = extract_adverse_events(text)
    severity = detect_severity(text)
    outcome = detect_outcome(text)

    report = Report.objects.create(
        original=text,
        drug=drug or "",
        adverse_events=",".join(events),
        severity=severity,
        outcome=outcome
    )
    serializer = ReportSerializer(report)
    return Response(serializer.data)

@api_view(["GET"])
def get_reports(request):
    reports = Report.objects.all().order_by("-id")
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)
