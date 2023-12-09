from rest_framework import serializers
from .models import Files, ScannedProject


class FilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Files
        fields = ['id', 'name', 'file', 'uploaded_at', 'file_hash']

class ScannedProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScannedProject
        fields = '__all__'