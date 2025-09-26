from django.db import models

class Report(models.Model):
    original = models.TextField()
    drug = models.CharField(max_length=255, blank=True)
    adverse_events = models.TextField(blank=True)  # comma-separated string
    severity = models.CharField(max_length=50, blank=True)
    outcome = models.CharField(max_length=50, blank=True)
    file = models.FileField(upload_to="reports/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def adverse_events_list(self):
        """Return adverse_events as a Python list"""
        if not self.adverse_events:
            return []
        return [event.strip() for event in self.adverse_events.split(",") if event.strip()]
