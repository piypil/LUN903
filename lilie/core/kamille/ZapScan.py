import subprocess
import os
import docker
import time

class ZapScan:

    def __init__(self, project_directory):
        # Получаем абсолютный путь к директории проекта
        self.project_directory = os.path.abspath(project_directory)
        self.container_id = None

    def stop_and_remove_container(self):
        client = docker.from_env()
        if self.container_id:
            container = client.containers.get(self.container_id)
            container.stop()
            container.remove()

    def scan_target_url(self):
        client = docker.from_env()

        # Путь к конфигурационному файлу в контейнере
        container_config_path = "/zap/wrk/TargetProjectConfig.yaml"

        # Запускаем контейнер с монтированием директории проекта в /zap/wrk/
        container = client.containers.run(
            'softwaresecurityproject/zap-stable',
            'bash -c "zap.sh -cmd -addonupdate; zap.sh -cmd -autorun {}"'.format(container_config_path),
            volumes={self.project_directory: {'bind': '/zap/wrk/', 'mode': 'rw'}},
            detach=True
        )
        self.container_id = container.id

        # Ждем завершения работы докера
        while True:
            container = client.containers.get(self.container_id)
            if container.status == 'exited':
                break
            time.sleep(25)

        self.stop_and_remove_container()

