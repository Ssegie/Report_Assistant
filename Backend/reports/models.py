from django.db import models

# Create your models here.
from django.db import models

class Report(models.Model):
    original = models.TextField()
    drug = models.CharField(max_length=100, blank=True)
    adverse_events = models.TextField(blank=True)  # comma-separated
    severity = models.CharField(max_length=50, blank=True)
    outcome = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
