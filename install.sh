#!/bin/bash

# PostgreSQL installation
sudo apt update
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nodejs npm
sudo -u postgres psql << EOF
CREATE DATABASE stiefmutterchen;
CREATE ROLE admin WITH PASSWORD 'password';
ALTER ROLE admin WITH LOGIN;
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET timezone TO 'UTC';
ALTER DATABASE stiefmutterchen OWNER TO admin;
GRANT ALL PRIVILEGES ON DATABASE stiefmutterchen TO admin;
\q
EOF

# Clone repository and setup virtual environment
git clone https://github.com/piypil/stiefmutterchen.git
cd stiefmutterchen/lilie 
sudo apt install python3-venv
python3 -m venv env
. env/bin/activate
pip install -r requirements.txt

# DependencyCheck installation
cd ..
sudo apt install default-jre unzip
wget https://github.com/jeremylong/DependencyCheck/releases/download/v8.3.1/dependency-check-8.3.1-release.zip
unzip dependency-check-8.3.1-release.zip
echo 'export PATH=$PATH:'$HOME'/stiefmutterchen/dependency-check/bin' >> ~/.bashrc
source ~/.bashrc

# Apply migrations and run server
cd /lilie
python3 manage.py makemigrations core 
python3 manage.py migrate

# Setup frontend
cd ../frontend
npm i
