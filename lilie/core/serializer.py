from rest_framework import serializers
from .models import Files


class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ['id', 'name', 'file', 'uploaded_at']