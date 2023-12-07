import os
import docker
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ZapScan:

    def __init__(self, project_directory, uuid):
        DOCKER_CONTAINER_RUN = os.environ.get('DOCKER_CONTAINER_RUN', "False")

        if DOCKER_CONTAINER_RUN.lower() == "true":
            self.project_directory = project_directory
        else:
            self.project_directory = os.path.abspath(project_directory)
        self.container_id = None
        self.uuid = uuid
        logger.info(f"Инициализация ZAPScan для директории: {self.project_directory} и uuid: {self.uuid}")


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

    def scan_target_url(self):
        client = docker.from_env()
        container_config_path = f"/shared/project_scan/{self.uuid}/TargetProjectConfig.yaml"

        if os.environ.get('DOCKER_CONTAINER_RUN', "False").lower() == "true":
            volumes_config = {
                'docker_shared-scan': {'bind': '/shared/project_scan/', 'mode': 'rw'}}
        else:
            volumes_config = {self.project_directory: {
                'bind': '/shared/project_scan/', 'mode': 'rw'}}
        
        logger.info(f"Запуск сканирования для {self.uuid} с использованием конфигурации томов: {volumes_config}")


        try:
            container = client.containers.run(
                'zap-container',
                f'bash -c "zap.sh -cmd -addonupdate; zap.sh -cmd -autorun {container_config_path}"',
                volumes=volumes_config,
                user='root',
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

        # self.stop_and_remove_container()
