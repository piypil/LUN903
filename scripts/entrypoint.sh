#!/bin/sh

source .env

if [ "$POSTGRES_DB" = "lun903" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"

    python3 manage.py migrate
fi

exec "$@"
