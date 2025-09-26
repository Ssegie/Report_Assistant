from django.urls import path
from . import views

urlpatterns = [
    path("process-report/", views.process_report),
    path("reports/", views.list_reports),
    path("translate/", views.translate_outcome),
]
