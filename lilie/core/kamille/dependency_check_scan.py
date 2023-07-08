import subprocess
import os

class DependencyCheckScan:
    def __init__(self, path):
        self.path = path
    
    def scan_direct(self):
        cmd = 'dependency-check -f JSON --prettyPrint -o '+ self.path + '/' + 'resultDependencyCheckScan -s ' + os.getcwd() +'/' + self.path
        process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        print(output.decode())

#dependency-check --prettyPrint --project DVWA -f JSON -s <PATH>
# add project name