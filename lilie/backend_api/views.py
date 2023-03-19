from django.shortcuts import render
from rest_framework.views import APIView
from .models import BanditModels
from .serializer import BanditModelsSerializer
from rest_framework.response import Response

# Create your views here.

class BanditModelsView(APIView):
    def get(self, request):
        output = [
            {
                "code_col": output.code_col,
                "col_offset": output.col_offset,
                "filename": output.filename,
                "issue_confidence": output.issue_confidence,
                "issue_cwe": output.issue_cwe,
                "issue_severity": output.issue_severity,
                "issue_text": output.issue_text,
                "line_number": output.line_number,
                "line_range": output.line_range,
                "more_info": output.more_info,
                "test_id": output.test_id,
                "test_name": output.test_name
            } for output in BanditModels.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = BanditModelsSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        