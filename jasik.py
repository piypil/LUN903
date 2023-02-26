import subprocess

file_path = "index.js"
command = f"npx eslint {file_path}"
subprocess.run(command, shell=True, check=True)

