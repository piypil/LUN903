import subprocess
import os
import docker

class ZapScan:

    def __init__(self, project_directory):
        # Получаем абсолютный путь к директории проекта
        self.project_directory = os.path.abspath(project_directory)

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
