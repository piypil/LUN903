import subprocess
import os

class CdxgenBomGenerate:
    def __init__(self, path):
        self.path = path
    
    def generate(self):
        cmd = 'cdxgen -o '+ self.path + '/' + 'bom.json -r ' + os.getcwd() +'/' + self.path
        process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        print(output.decode())
