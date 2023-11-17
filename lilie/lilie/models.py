from django.db import models
import uuid

class ScannedProject(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    project_name = models.CharField(max_length=255, default='Project')
    url = models.URLField()
    scan_date = models.DateTimeField(auto_now_add=True)
    results = models.JSONField(null=True, blank=True)

class Files(models.Model):
    file = models.FileField(upload_to='project/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    project_id = models.CharField(max_length=10)
    file_hash = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

class ResultsBandit(models.Model):
    file = models.ForeignKey(Files, on_delete=models.CASCADE)
    result_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

class ResultsCodeQL(models.Model):
    file = models.ForeignKey(Files, on_delete=models.CASCADE)
    result_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

class ResultsSCA(models.Model):
    file = models.ForeignKey(Files, on_delete=models.CASCADE)
    result_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
