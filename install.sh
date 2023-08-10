#!/bin/bash
sudo apt update
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nodejs npm

# Setup virtual environment and configure project settings
read -srp "Enter the DB_PASS: " db_pass

db_host=$(hostname -I | awk '{print $1}')
django_secret_key=$(openssl rand -hex 32)

read -rp "Enable DJANGO_DEBUG mode? (y/n): " debug_choice
if [ "$debug_choice" = "y" ]; then
  django_debug="True"
else
  django_debug="False"
fi

# PostgreSQL installation
sudo -u postgres psql << EOF
CREATE DATABASE stiefmutterchen;
CREATE ROLE admin WITH PASSWORD '$db_pass';
ALTER ROLE admin WITH LOGIN;
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET timezone TO 'UTC';
ALTER DATABASE stiefmutterchen OWNER TO admin;
GRANT ALL PRIVILEGES ON DATABASE stiefmutterchen TO admin;
\q
EOF

{
  export DB_NAME=stiefmutterchen
  export DB_USER=admin
  export DB_PASS=$db_pass
  export DB_HOST=localhost
  export DB_PORT=5432

  export ZAP_KEY=ZAP_KEY
  export ZAP_PORT=8080
  export ZAP_HOST=localhost

  export DJANGO_SECRET_KEY=$django_secret_key
  export DJANGO_DEBUG=$django_debug
  export DJANGO_ALLOWED_HOSTS=$db_host
} >> lilie/.env

sudo apt install python3-venv
python3 -m venv /lilie/env
source lilie/env/bin/activate
pip install -r requirements.txt

# DependencyCheck installation
sudo apt install default-jre unzip
wget https://github.com/jeremylong/DependencyCheck/releases/download/v8.3.1/dependency-check-8.3.1-release.zip
unzip dependency-check-8.3.1-release.zip
echo "export PATH=\$PATH:\$HOME/stiefmutterchen/dependency-check/bin" >> ~/.bashrc && source ~/.bashrc
rm dependency-check-8.3.1-release.zip

# Apply migrations and run server

python3 lilie/manage.py makemigrations core 
python3 lilie/manage.py migrate

# Setup frontend
cd frontend/ || exit
npm i
echo "REACT_APP_API_URL = http://localhost:8000/api" >> .env



