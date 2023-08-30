#!/bin/sh

source .env

if [ "$DB_NAME" = "lun903" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"

    python3 manage.py migrate
fi

exec "$@"
