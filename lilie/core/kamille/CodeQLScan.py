import os
import docker


class CodeQLScan:

    def __init__(self, project_directory):
        DOCKER_CONTAINER_RUN = os.environ.get('DOCKER_CONTAINER_RUN', "False")

        if DOCKER_CONTAINER_RUN.lower() == "true":
            self.project_directory = project_directory
        else:
            self.project_directory = os.path.abspath(project_directory)
        self.container_id = None

    def stop_and_remove_container(self):
        client = docker.from_env()
        try:
            if self.container_id:
                container = client.containers.get(self.container_id)
                container.stop()
                container.remove()
        except docker.errors.NotFound:
            print(f"Контейнер {self.container_id} не найден.")

    def scan_target_path(self):
        client = docker.from_env()
        print("Зашли в CodeQL")
        if os.environ.get('DOCKER_CONTAINER_RUN', "False").lower() == "true":
            print("Docker path")
            volumes_config = {
                'docker_shared-scan': {'bind': '/opt/src/', 'mode': 'rw'}}
        else:
            print("Normal Path")
            volumes_config = {
                self.project_directory: {'bind': '/opt/src/', 'mode': 'rw'}
                }
        try:
            container = client.containers.run(
                'codeql-container',
                volumes=volumes_config,
                detach=True
            )
            self.container_id = container.id
            print("Запустили")
            container.wait()
        except docker.errors.ContainerError as e:
            print(f"Ошибка запуска контейнера: {e}")
        except docker.errors.ImageNotFound:
            print("Образ Docker не найден.")
        except docker.errors.APIError as e:
            print(f"Ошибка Docker API: {e}")

        self.stop_and_remove_container()
