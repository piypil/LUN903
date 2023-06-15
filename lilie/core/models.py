from django.db import models

class Files(models.Model):
    file = models.FileField(upload_to='project/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    project_id = models.CharField(max_length=10)

    def __str__(self):
        return self.file