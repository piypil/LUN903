import os
import docker
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class CodeQLScan:

    def __init__(self, project_directory, file_hash):
        DOCKER_CONTAINER_RUN = os.environ.get('DOCKER_CONTAINER_RUN', "False")

        if DOCKER_CONTAINER_RUN.lower() == "true":
            self.project_directory = project_directory
        else:
            self.project_directory = os.path.abspath(project_directory)
        self.container_id = None
        self.file_hash = str(file_hash)
        logger.info(f"Инициализация CodeQLScan для директории: {self.project_directory} и file_hash: {self.file_hash}")

    def stop_and_remove_container(self):
        client = docker.from_env()
        try:
            if self.container_id:
                container = client.containers.get(self.container_id)
                container.stop()
                container.remove()
                logger.info(f"Контейнер {self.container_id} остановлен и удалён.")
        except docker.errors.NotFound:
            logger.warning(f"Контейнер {self.container_id} не найден.")

    def scan_target_path(self):
        client = docker.from_env()
        volumes_config = {
            'docker_shared-scan': {'bind': f'/opt/src/', 'mode': 'rw'}
        } if os.environ.get('DOCKER_CONTAINER_RUN', "False").lower() == "true" else {
            self.project_directory: {'bind': f'/opt/src/{self.file_hash}', 'mode': 'rw'}
        }

        logger.info(f"Запуск сканирования для {self.file_hash} с использованием конфигурации томов: {volumes_config}")

        try:
            container = client.containers.run(
                'codeql-container',
                command=self.file_hash,
                volumes=volumes_config,
                detach=True
            )
            self.container_id = container.id
            logger.info(f"Контейнер для сканирования запущен с ID: {self.container_id}")
            container.wait()
            logger.info(f"Сканирование для контейнера {self.container_id} завершено.")
        except docker.errors.ContainerError as e:
            logger.error(f"Ошибка запуска контейнера: {e}")
        except docker.errors.ImageNotFound:
            logger.error("Образ Docker не найден.")
        except docker.errors.APIError as e:
            logger.error(f"Ошибка Docker API: {e}")
