import subprocess

path = input('Path: ')

cmd = 'bandit -f json -o result -r ' + path 
process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
output, error = process.communicate()
print(output.decode())
