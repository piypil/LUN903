from django.db import models


class Files(models.Model):
    file = models.FileField(upload_to='project/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    project_id = models.CharField(max_length=10)


class Results(models.Model):
    file = models.ForeignKey(Files, on_delete=models.CASCADE)
    result_data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
