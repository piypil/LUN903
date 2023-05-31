from django.db import models

# Create your models here.
class BanditModels(models.Model):
    code_col = models.CharField(max_length=100)
    col_offset = models.CharField(max_length=100)
    filename = models.CharField(max_length=100)
    issue_confidence = models.CharField(max_length=100)
    issue_cwe = models.CharField(max_length=100)
    issue_severity = models.CharField(max_length=100)
    issue_text = models.CharField(max_length=100)
    line_number = models.CharField(max_length=100)
    line_range = models.CharField(max_length=100)
    more_info = models.CharField(max_length=100)
    test_id = models.CharField(max_length=100)
    test_name = models.CharField(max_length=100)

class UploadedFile(models.Model):
    name = models.CharField(max_length=255)
    project_id = models.CharField(max_length=10)
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
