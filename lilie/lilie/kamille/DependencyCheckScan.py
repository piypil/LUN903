import subprocess
import os

class DependencyCheckScan:
    def __init__(self, path):
        self.path = path

    def scan_direct(self):
        cmd = 'dependency-check -f JSON --prettyPrint -o '+ self.path + '/' + 'resultDependencyCheckScan -s ' + os.getcwd() +'/' + self.path
        process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, error = process.communicate()

        if process.returncode != 0:
            print(f"Error occurred: {error.decode()}")
        else:
            print(output.decode())
