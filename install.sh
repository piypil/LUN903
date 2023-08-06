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

# Setup virtual environment and configure project settings
cd lilie/
read -sp "Enter the DB_PASS: " db_pass

db_host=$(hostname)
django_secret_key=$(openssl rand -hex 32)

read -p "Enable DJANGO_DEBUG mode? (y/n): " debug_choice
if [ "$debug_choice" = "y" ]; then
  django_debug="True"
else
  django_debug="False"
fi

echo "export DB_NAME=stiefmutterchen" >> .env
echo "export DB_USER=admin" >> .env
echo "export DB_PASS=$db_pass" >> .env
echo "export DB_HOST=$db_host" >> .env
echo "export DB_PORT=5432" >> .env

echo "export ZAP_KEY=<ZAP_KEY>" >> .env
echo "export ZAP_PORT=8080" >> .env
echo "export ZAP_HOST=localhost" >> .env

echo "export DJANGO_SECRET_KEY=$django_secret_key" >> .env
echo "export DJANGO_DEBUG=$django_debug" >> .env
echo "export DJANGO_ALLOWED_HOSTS=$db_host" >> .env

sudo apt install python3-venv
python3 -m venv env
source env/bin/activate
cd ..
pip install -r requirements.txt

# DependencyCheck installation
sudo apt install default-jre unzip
wget https://github.com/jeremylong/DependencyCheck/releases/download/v8.3.1/dependency-check-8.3.1-release.zip
unzip dependency-check-8.3.1-release.zip
echo 'export PATH=$PATH:'$HOME'/stiefmutterchen/dependency-check/bin' >> ~/.bashrc
source ~/.bashrc

# Apply migrations and run server
cd lilie/
python3 manage.py makemigrations core 
python3 manage.py migrate

# Setup frontend
cd ../frontend
npm i
echo "REACT_APP_API_URL = http://$db_host:8000/api" >> .env



