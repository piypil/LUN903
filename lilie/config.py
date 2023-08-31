import os

from dotenv import load_dotenv

load_dotenv()

POSTGRES_HOST = str(os.getenv("POSTGRES_HOST"))
POSTGRES_PORT = str(os.getenv("POSTGRES_PORT"))
POSTGRES_USER = str(os.getenv("POSTGRES_USER"))
POSTGRES_PASSWORD = str(os.getenv("POSTGRES_PASSWORD"))
POSTGRES_DB = str(os.getenv("POSTGRES_DB"))

ZAP_KEY = str(os.getenv("ZAP_KEY"))
ZAP_PORT = str(os.getenv("ZAP_PORT"))
ZAP_HOST = str(os.getenv("ZAP_HOST"))

DJANGO_SECRET_KEY = str(os.getenv("DJANGO_SECRET_KEY"))
DJANGO_DEBUG = bool(os.getenv("DJANGO_DEBUG"))
DJANGO_ALLOWED_HOSTS = str(os.getenv("DJANGO_ALLOWED_HOSTS"))
