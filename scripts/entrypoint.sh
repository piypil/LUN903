#!/bin/sh

source .env

if [ "$POSTGRES_DB" = "lun903" ]
then
    echo "Waiting for postgres..."

    while ! nc -zv $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"

    sleep 5

    python3 manage.py makemigrations core
    python3 manage.py migrate
    
fi

exec "$@"
