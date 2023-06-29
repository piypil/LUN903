import zipfile
import psycopg2
import os
import config
import json

from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction

from .models import Files, Results
from .serializer import FilesSerializer
from .kamille import bandit_scan
from zap import scanner_zap


def get_last_uploaded_file_id(cursor):
    cursor.execute("SELECT id FROM core_files ORDER BY id DESC LIMIT 1;")
    return cursor.fetchone()[0]

def get_file_data(cursor, file_id):
    cursor.execute("SELECT file FROM core_files WHERE id = %s", (file_id,))
    return cursor.fetchone()[0]

def extract_zip_file(file_data, random_id):
    path = f"project_scann/{random_id}"
    os.makedirs(path, exist_ok=True)
    with open(f'uploads/{file_data}', 'rb') as file:
        with zipfile.ZipFile(file) as myzip:
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

def upload_file():
    conn = connect_to_database()

    with conn.cursor() as cur:
        file_id = get_last_uploaded_file_id(cur)
        file_data = get_file_data(cur, file_id)
        path = extract_zip_file(file_data, file_id)
        b = bandit_scan.Bandit(path)
        b.scan_direct()
        cur.close()
    conn.close()

    with open(path + '/result', 'r') as json_file:
        results = json.load(json_file)

    with transaction.atomic():
        file_instance = Files.objects.get(id=file_id)
        results_instance = Results(file=file_instance, result_data=results)
        results_instance.save()


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            upload_file()

        return response

class ResultsAPIView(APIView):
    def get(self, request, file_id):
        results = Results.objects.filter(file_id=file_id)
        data = []
        for result in results:
            result_data = {
                'file_id': result.file_id,
                'result_data': result.result_data,
                'created_at': result.created_at
            }
            data.append(result_data)
        return Response(data)

class CodeAPIView(APIView):
    def get(self, request):
        file_path = request.GET.get('file_path', '')
        file_full_path = os.path.join('project_scann/', file_path)
        try:
            with open(file_full_path, 'r') as file:
                code = file.read()
        except FileNotFoundError:
            return Response({'error': 'File not found'}, status=404)
        
        return Response({'code': code})

@api_view(['POST'])
def scan_url(request):
    url = request.data.get('url')
    zap_address = config.ZAP_HOST
    zap_port = config.ZAP_PORT
    api_key = config.ZAP_KEY

    if url:
        scanner = scanner_zap.OWASPZAPScanner(zap_address, zap_port, api_key)
        scanner.start_scan(url)
        return Response({'message': f'Scan started successfully for URL: {url}'})
    else:
        return Response({'error': 'URL is required.'}, status=400)
