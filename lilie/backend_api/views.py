from django.shortcuts import render
from rest_framework.views import APIView
from .models import BanditModels, UploadedFile
from .serializer import BanditModelsSerializer
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from .forms import UploadFileForm
from .kamille import bandit_scan

import zipfile
import psycopg2
import random
import os
import string
import glob
import config

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

def get_last_uploaded_file_id(cursor):
    cursor.execute("SELECT name FROM backend_api_uploadedfile ORDER BY id DESC LIMIT 1;")
    return cursor.fetchone()[0]

def get_file_data(cursor, file_id):
    cursor.execute("SELECT file FROM backend_api_uploadedfile WHERE name = %s", (file_id,))
    return cursor.fetchone()[0]

def extract_zip_file(file_data):
    random_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    path = f"project_scann/{random_id}"
    os.makedirs(path)
    with zipfile.ZipFile(file_data) as myzip:
        myzip.extractall(path=path)
    return path

def connect_to_database():
    conn = psycopg2.connect(
        dbname=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASS,
        host=config.DB_HOST,
        port=config.DB_PORT
    )
    return conn

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()

        conn = connect_to_database()
        with conn.cursor() as cur:
            file_id = get_last_uploaded_file_id(cur)
            file_data = get_file_data(cur, file_id)
            cur.close()
        conn.close()

        path = extract_zip_file(file_data)
        b = bandit_scan.Bandit(path)
        b.scan_direct()
        return render(request, 'upload_success.html')
    else:
        form = UploadFileForm()
    return render(request, 'upload_form.html', {'form': form})
