import os
import json
import logging

from rest_framework.decorators import api_view
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Files, ResultsBandit, ResultsCodeQL, ResultsSCA, ScannedProject
from .serializer import FilesSerializer, ScannedProjectSerializer
from .kamille.FullScanParserZAP import FullScanParserZAP
from .kamille.ZapScan import ZapScan
from .tasks import upload_file_and_scan

logger = logging.getLogger(__name__)


class FilesViewSet(viewsets.ModelViewSet):
    serializer_class = FilesSerializer
    queryset = Files.objects.all()

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            upload_file_and_scan.delay()

        return response

    def get_queryset(self):
        if "file_hash" in self.kwargs:
            return Files.objects.filter(file_hash=self.kwargs["file_hash"])
        return Files.objects.all()

    def retrieve(self, request, *args, **kwargs):
        file_hash = kwargs.get('file_hash')
        file_instance = get_object_or_404(Files, file_hash=file_hash)
        serializer = self.get_serializer(file_instance)
        return Response(serializer.data)
    
class ResultsAPIView(APIView):
    def get(self, request, file_hash):
        results = ResultsBandit.objects.filter(file__file_hash=file_hash)
        data = []
        for result in results:
            result_data = {
                'file_hash': result.file.file_hash,
                'result_data': result.result_data,
                'created_at': result.created_at
            }
            data.append(result_data)
        return Response(data)

class ResultsAPIViewCodeQl(APIView):
    def get(self, request, file_hash):
        results = ResultsCodeQL.objects.filter(file__file_hash=file_hash)
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
        file_full_path = os.path.join('project_scan/', file_path)
        try:
            with open(file_full_path, 'r') as file:
                code = file.read()
        except FileNotFoundError:
            return Response({'error': 'File not found'}, status=404)
        
        return Response({'code': code})

@api_view(['POST'])
def scan_url(request):
    DOCKER_CONTAINER_RUN = os.environ.get('DOCKER_CONTAINER_RUN', "False")

    url = request.data.get('url')
    projectName = request.data.get('projectName')

    # Создаем запись в базе данных
    project = ScannedProject(project_name=projectName, url=url)
    project.save()

    # Определение пути к директории проекта
    base_path = "/shared/project_scan" if DOCKER_CONTAINER_RUN.lower() == "true" else "project_scan"
    directory_path = os.path.join(base_path, str(project.uuid))
    os.makedirs(directory_path, exist_ok=True)

    # Создаем и сохраняем конфигурационный файл ZAP
    parser = FullScanParserZAP(url, directory_path)
    parser.render_data()

    # Запускаем сканирование с помощью ZAP
    zap_scanner = ZapScan(directory_path, str(project.uuid))
    zap_scanner.scan_target_url()

    try:
        # Чтение файла отчета
        report_path = os.path.join(directory_path, "TargetProjectReport.json")
        with open(report_path, 'r') as report_file:
            scan_results = json.load(report_file)

        # Сохранение результатов в базе данных
        project.results = scan_results
        project.save()
        message = "Scan completed and results saved."
    except FileNotFoundError:
        message = "Report file not found. Scan may have failed or not completed."

    return Response({"message": message})


class ResultsAPIViewDAST(APIView):
    def get(self, request, uuid):
        try:
            project = ScannedProject.objects.get(uuid=uuid)
            results = project.results
            return Response({'results': results})
        except ScannedProject.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)


class ScannedProjectListView(generics.ListAPIView):
    queryset = ScannedProject.objects.all()
    serializer_class = ScannedProjectSerializer
