import zipfile
import psycopg2
import os
import config
import json
import time
import logging

from django.db import transaction
from celery import shared_task

from .models import Files, ResultsBandit, ResultsCodeQL, ResultsSCA
from .kamille.CodeQLScan import CodeQLScan
from .kamille.BanditScan import BanditScan
from .kamille.DependencyCheckScan import DependencyCheckScan

logger = logging.getLogger(__name__)

def get_last_uploaded_file_hash(cursor):
    try:
        cursor.execute("SELECT file_hash FROM lilie_files ORDER BY uploaded_at DESC LIMIT 1;")
        return cursor.fetchone()[0]
    except Exception as e:
        logger.error(f"Ошибка при получении последнего загруженного file_hash: {e}")
        return None

def get_file_data(cursor, file_hash):
    try:
        cursor.execute("SELECT file FROM lilie_files WHERE file_hash = %s", (file_hash,))
        result = cursor.fetchone()
        logger.info(f"Результат file_hash {file_hash}: {result}")
        if result:
            return result[0]
        else:
            logger.warning(f"Нет данных file_hash: {file_hash}")
            return None
    except Exception as e:
        logger.error(f"Ошибка при получении данных файла для file_hash {file_hash}: {e}")
        return None

def extract_zip_file(file_data, file_hash):
    try:
        path = f"project_scan/{file_hash}"
        path_shared = f"/shared/project_scan/{file_hash}"
        os.makedirs(path, exist_ok=True)
        with open(f'uploads/{file_data}', 'rb') as file:
            with zipfile.ZipFile(file) as myzip:
                myzip.extractall(path=path)
                myzip.extractall(path=path_shared)
        return path
    except Exception as e:
        logger.error(f"Ошибка при извлечении файла {file_data} с file_hash {file_hash}: {e}")
        return None

def connect_to_database():
    try:
        conn = psycopg2.connect(
            dbname=config.POSTGRES_DB,
            user=config.POSTGRES_USER,
            password=config.POSTGRES_PASSWORD,
            host=config.POSTGRES_HOST,
            port=config.POSTGRES_PORT
        )
        return conn
    except Exception as e:
        logger.error("Ошибка при подключении к базе данных: {}".format(e))
        return None

@shared_task()
def upload_file_and_scan():
    time.sleep(5)
    DOCKER_CONTAINER_RUN = os.environ.get('DOCKER_CONTAINER_RUN', "False")

    conn = connect_to_database()

    try:
        with conn.cursor() as cur:
            file_hash = get_last_uploaded_file_hash(cur)
            file_data = get_file_data(cur, file_hash)
            path = extract_zip_file(file_data, file_hash)

            try:
                bandit_scan = BanditScan(path)
                bandit_scan.scan_direct()
            except Exception as e:
                logger.error(f"Ошибка при сканировании Bandit: {e}")

            try:
                dependency_scan = DependencyCheckScan(path)
                dependency_scan.scan_direct()
            except Exception as e:
                logger.error(f"Ошибка при сканировании Dependency Check: {e}")

            base_path = "/shared/project_scan/" if DOCKER_CONTAINER_RUN.lower() == "true" else "project_scan/"
            directory_path_codeql = f"{base_path}{file_hash}"

            try:
                codeql_scan = CodeQLScan(directory_path_codeql, file_hash)
                codeql_scan.scan_target_path()
            except Exception as e:
                logger.error(f"Ошибка при сканировании CodeQL: {e}")

            results_file_path = path + '/result'
            dependency_check_file_path = path + '/resultDependencyCheckScan/dependency-check-report.json'
            sast_report_file_path = directory_path_codeql + '/gl-sast-report.json'

            try:
                with open(results_file_path, 'r') as json_file:
                    results = json.load(json_file)
            except FileNotFoundError:
                logger.error(f"Файл результатов {results_file_path} не найден.")
                
            try:
                with open(dependency_check_file_path, 'r') as json_file:
                    results_sca = json.load(json_file)
            except FileNotFoundError:
                logger.error(f"Файл результатов сканирования зависимостей {dependency_check_file_path} не найден.")

            try:
                with open(sast_report_file_path, 'r') as json_file:
                    results_codeql = json.load(json_file)
            except FileNotFoundError:
                logger.error(f"Файл отчета CodeQL {sast_report_file_path} не найден.")
                results_codeql = {}

            cur.close()

        with transaction.atomic():
            file_instance = Files.objects.get(file_hash=file_hash)
            results_instance = ResultsBandit(file=file_instance, result_data=results)
            results_instance_sca = ResultsSCA(file=file_instance, result_data=results_sca)
            results_instance_codeql = ResultsCodeQL(file=file_instance, result_data=results_codeql)
            results_instance.save()
            results_instance_sca.save()
            results_instance_codeql.save()

    except Exception as e:
        logger.error(f"Ошибка в процессе загрузки и сканирования файла: {e}")
    finally:
        if conn:
            conn.close()