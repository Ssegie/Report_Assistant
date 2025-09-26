from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    # Accept lists from frontend
    adverse_events = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    # Expose file in API responses
    file = serializers.FileField(read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "original",
            "drug",
            "adverse_events",
            "severity",
            "outcome",
            "file",
            "created_at",
        ]

    def create(self, validated_data):
        # Pop list and join into string
        adverse_events_list = validated_data.pop("adverse_events", [])
        validated_data["adverse_events"] = ",".join(adverse_events_list)
        return Report.objects.create(**validated_data)

    def update(self, instance, validated_data):
        adverse_events_list = validated_data.pop("adverse_events", None)
        if adverse_events_list is not None:
            validated_data["adverse_events"] = ",".join(adverse_events_list)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        """Convert stored string back to list for frontend"""
        data = super().to_representation(instance)
        if instance.adverse_events:
            data["adverse_events"] = [
                e.strip() for e in instance.adverse_events.split(",") if e.strip()
            ]
        else:
            data["adverse_events"] = []
        return data
