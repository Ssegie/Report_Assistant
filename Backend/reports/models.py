from django.db import models

class Report(models.Model):
    original = models.TextField()
    drug = models.CharField(max_length=100, null=True, blank=True)
    adverse_events = models.TextField(null=True, blank=True)  
    severity = models.CharField(max_length=50, null=True, blank=True)
    outcome = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def adverse_events_list(self):
        return self.adverse_events.split(",") if self.adverse_events else []
