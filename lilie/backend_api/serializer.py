from rest_framework import serializers
from .models import BanditModels

class BanditModelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BanditModels
        fields = ['code_col', 'col_offset', 'filename', 'issue_confidence', 'issue_cwe', 'issue_severity', 'issue_text', 'line_number', 'line_range', 'more_info', 'test_id', 'test_name']