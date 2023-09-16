import zipfile
import psycopg2
import os
import config
import json
import multiprocessing
import logging

from rest_framework.decorators import api_view
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from django.core.exceptions import AppRegistryNotReady
from django.http import JsonResponse
from multiprocessing import Queue

from .models import Files, Results, ResultsSCA, ScannedProject
from .serializer import FilesSerializer, ScannedProjectSerializer
from zap import scanner_zap
from tqdm import tqdm


logger = logging.getLogger(__name__)

progress_queue = Queue()
progress = 0


def get_last_uploaded_file_hash(cursor):
    cursor.execute("SELECT file_hash FROM core_files ORDER BY file_hash DESC LIMIT 1;")
    return cursor.fetchone()[0]

def get_file_data(cursor, file_hash):
    cursor.execute("SELECT file FROM core_files WHERE file_hash = %s", (file_hash,))
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
        dbname=config.POSTGRES_DB,
        user=config.POSTGRES_USER,
        password=config.POSTGRES_PASSWORD,
        host=config.POSTGRES_HOST,
        port=config.POSTGRES_PORT
    )
    return conn

def upload_file(progress_queue):
    
    global progress
    
    progress = 0

    try:
        from .scan_helper import bandit_scan_worker, dependency_check_scan_worker
    except AppRegistryNotReady:
        pass
    
    conn = connect_to_database()

    with conn.cursor() as cur:
        file_hash = get_last_uploaded_file_hash(cur)
        file_data = get_file_data(cur, file_hash)
        path = extract_zip_file(file_data, file_hash)

        bandit_process = multiprocessing.Process(target=bandit_scan_worker, args=(path, progress_queue))
        dependency_check_process = multiprocessing.Process(target=dependency_check_scan_worker, args=(path, progress_queue))
        bandit_process.start()
        dependency_check_process.start()

        total_scans = 2
        for _ in tqdm(range(total_scans), desc="Scanning", unit="scan"):
            progress_queue.get()
            progress += 50

        bandit_process.join()
        dependency_check_process.join()

        cur.close()
    conn.close()

    with open(path + '/result', 'r') as json_file:
        results = json.load(json_file)

    with open(path + '/resultDependencyCheckScan/dependency-check-report.json', 'r') as json_file:
        results_sca = json.load(json_file)

    file_instance = Files.objects.get(file_hash=file_hash)

    with transaction.atomic():
        results_instance = Results(file=file_instance, result_data=results)
        results_instance_sca = ResultsSCA(file=file_instance, result_data=results_sca)
        results_instance.save()
        results_instance_sca.save()


@api_view(['GET'])
def get_scan_progress(request):
    global progress
    return JsonResponse({'progress': progress})

class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            upload_file(progress_queue)

        return response

class ResultsAPIView(APIView):
    def get(self, request, file_hash):
        results = Results.objects.filter(file__file_hash=file_hash)
        data = []
        for result in results:
            result_data = {
                'file_hash': result.file.file_hash,
                'result_data': result.result_data,
                'created_at': result.created_at
            }
            data.append(result_data)
        return Response(data)

class ResultsAPIViewSCA(APIView):
    def get(self, request, file_hash):
        results = ResultsSCA.objects.filter(file__file_hash=file_hash)
        data = []
        for result in results:
            result_data = {
                'file_hash': result.file.file_hash,
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
    projectName = request.data.get('projectName')
    zap_address = config.ZAP_HOST
    zap_port = config.ZAP_PORT
    api_key = config.ZAP_KEY

    if url:
        scanner = scanner_zap.OWASPZAPScanner(zap_address, zap_port, api_key)
        scanner.start_scan(url)

        project = ScannedProject(url=url, project_name=projectName)
        project.save()

        return Response({'message': f'Scan started successfully for URL: {url}'})
    else:
        return Response({'error': 'URL is required.'}, status=400)


class ResultsUrlAPIView(APIView):
    def get(self, request, project_id):
        try:
            project = ScannedProject.objects.get(id=project_id)
            results = project.results
            return Response({'results': results})
        except ScannedProject.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)


class ScannedProjectListView(generics.ListAPIView):
    queryset = ScannedProject.objects.all()
    serializer_class = ScannedProjectSerializer