from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    adverse_events = serializers.ListField(
        child=serializers.CharField(), source="adverse_events_list", read_only=True
    )

    class Meta:
        model = Report
        fields = ["id", "original", "drug", "adverse_events", "severity", "outcome", "created_at"]
