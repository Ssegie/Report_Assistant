from django.db import models

class Report(models.Model):
    original = models.TextField()
    drug = models.CharField(max_length=255)
    adverse_events = models.TextField(blank=True)
    severity = models.CharField(max_length=50)
    outcome = models.CharField(max_length=50)
    file = models.FileField(upload_to="reports/", null=True, blank=True)  # ✅ allows file uploads
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def adverse_events_list(self):
        """Return adverse_events as a Python list"""
        if not self.adverse_events:
            return []
        return [event.strip() for event in self.adverse_events.split(",") if event.strip()]

    def __str__(self):
        # Display drug name and severity for easier admin viewing
        return f"{self.drug} - {self.severity}"
