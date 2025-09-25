from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    adverse_events = serializers.ListField(
        child=serializers.CharField(), source="adverse_events_list"
    )

    class Meta:
        model = Report
        fields = ["id", "original", "drug", "adverse_events", "severity", "outcome"]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep["adverse_events"] = instance.adverse_events.split(",") if instance.adverse_events else []
        return rep

    def create(self, validated_data):
        events = validated_data.pop("adverse_events_list", [])
        validated_data["adverse_events"] = ",".join(events)
        return super().create(validated_data)
