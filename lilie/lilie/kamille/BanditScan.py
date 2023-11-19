import subprocess
import os

class BanditScan:
    def __init__(self, path):
        self.path = path
    
    def scan_direct(self):
        cmd = 'bandit -f json -o '+ self.path + '/' + 'result -r ' + os.getcwd() +'/' + self.path
        process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        print(output.decode())
