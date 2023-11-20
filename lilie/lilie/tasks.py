import zipfile
import psycopg2
import os
import config
import json
import time

from django.db import transaction
from celery import shared_task

from .models import Files, ResultsBandit, ResultsCodeQL, ResultsSCA
from .kamille.CodeQLScan import CodeQLScan
from .kamille.BanditScan import BanditScan
from .kamille.DependencyCheckScan import DependencyCheckScan

def get_last_uploaded_file_hash(cursor):
    cursor.execute("SELECT file_hash FROM lilie_files ORDER BY uploaded_at DESC LIMIT 1;")
    return cursor.fetchone()[0]

def get_file_data(cursor, file_hash):
    cursor.execute("SELECT file FROM lilie_files WHERE file_hash = %s", (file_hash,))
    result = cursor.fetchone()
    print(f"Result for file_hash {file_hash}: {result}")
    if result:
        return result[0]
    else:
        print(f"No data found for file_hash: {file_hash}")
        return None

def extract_zip_file(file_data, file_hash):
    path = f"project_scan/{file_hash}"
    path_shared = f"/shared/project_scan/{file_hash}"
    os.makedirs(path, exist_ok=True)
    with open(f'uploads/{file_data}', 'rb') as file:
        with zipfile.ZipFile(file) as myzip:
            myzip.extractall(path=path)
            myzip.extractall(path=path_shared)
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

@shared_task()
def upload_file_and_scan():
    time.sleep(5)
    DOCKER_CONTAINER_RUN = os.environ.get('DOCKER_CONTAINER_RUN', "False")

    
    conn = connect_to_database()

    with conn.cursor() as cur:
        file_hash = get_last_uploaded_file_hash(cur)
        file_data = get_file_data(cur, file_hash)
        path = extract_zip_file(file_data, file_hash)

        bandit_scan = BanditScan(path)
        bandit_scan.scan_direct()

        dependency_scan = DependencyCheckScan(path)
        dependency_scan.scan_direct()

        base_path = "/shared/project_scan/" if DOCKER_CONTAINER_RUN.lower() == "true" else "project_scan/"
        directory_path_codeql = f"{base_path}{file_hash}"
        codeql_scan = CodeQLScan(directory_path_codeql, file_hash)
        codeql_scan.scan_target_path()

        cur.close()
    conn.close()

    with open(path + '/result', 'r') as json_file:
        results = json.load(json_file)

    with open(path + '/resultDependencyCheckScan/dependency-check-report.json', 'r') as json_file:
        results_sca = json.load(json_file)
    
    with open(directory_path_codeql + '/gl-sast-report.json', 'r') as json_file:
        results_codeql = json.load(json_file)

    file_instance = Files.objects.get(file_hash=file_hash)

    with transaction.atomic():
        results_instance = ResultsBandit(file=file_instance, result_data=results)
        results_instance_sca = ResultsSCA(file=file_instance, result_data=results_sca)
        results_instance_codeql = ResultsCodeQL(file=file_instance, result_data=results_codeql)
        results_instance.save()
        results_instance_sca.save()
        results_instance_codeql.save()