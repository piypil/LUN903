#!/bin/bash
sudo apt update
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nodejs npm

# Setup virtual environment and configure project settings
read -srp "Enter the POSTGRES_PASSWORD: " POSTGRES_PASSWORD

POSTGRES_HOST=$(hostname -I | awk '{print $1}')
django_secret_key=$(openssl rand -hex 32)

read -rp "Enable DJANGO_DEBUG mode? (y/n): " debug_choice
if [ "$debug_choice" = "y" ]; then
  django_debug="True"
else
  django_debug="False"
fi

# PostgreSQL installation
sudo -u postgres psql << EOF
CREATE DATABASE lun903;
CREATE ROLE admin WITH PASSWORD '$POSTGRES_PASSWORD';
ALTER ROLE admin WITH LOGIN;
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin SET timezone TO 'UTC';
ALTER DATABASE lun903 OWNER TO admin;
GRANT ALL PRIVILEGES ON DATABASE lun903 TO admin;
\q
EOF

{
  echo "export POSTGRES_DB=lun903"
  echo "export POSTGRES_USER=admin"
  echo "export POSTGRES_PASSWORD=$POSTGRES_PASSWORD"
  echo "export POSTGRES_HOST=localhost"
  echo "export POSTGRES_PORT=5432"

  echo "export ZAP_KEY=ZAP_KEY"
  echo "export ZAP_PORT=8080"
  echo "export ZAP_HOST=localhost"

  echo "export DJANGO_SECRET_KEY=$django_secret_key"
  echo "export DJANGO_DEBUG=$django_debug"
  echo "export DJANGO_ALLOWED_HOSTS=$POSTGRES_HOST"
} >> lilie/.env

sudo apt install python3-venv
python3 -m venv lilie/env
source lilie/env/bin/activate
pip install -r requirements.txt

# DependencyCheck installation
sudo apt install default-jre unzip
wget https://github.com/jeremylong/DependencyCheck/releases/download/v8.3.1/dependency-check-8.3.1-release.zip
unzip dependency-check-8.3.1-release.zip
echo "export PATH=\$PATH:\$HOME/LUN903/dependency-check/bin" >> ~/.bashrc && source ~/.bashrc
rm dependency-check-8.3.1-release.zip

# Apply migrations and run server

python3 lilie/manage.py makemigrations core 
python3 lilie/manage.py migrate

# Setup frontend
cd frontend/ || exit
npm i
echo "REACT_APP_API_URL = http://localhost:8000/api" >> .env



