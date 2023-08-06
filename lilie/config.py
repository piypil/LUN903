import os

from dotenv import load_dotenv

load_dotenv()

DB_HOST = str(os.getenv("DB_HOST"))
DB_PORT = str(os.getenv("DB_PORT"))
DB_USER = str(os.getenv("DB_USER"))
DB_PASS = str(os.getenv("DB_PASS"))
DB_NAME = str(os.getenv("DB_NAME"))

ZAP_KEY = str(os.getenv("ZAP_KEY"))
ZAP_PORT = str(os.getenv("ZAP_PORT"))
ZAP_HOST = str(os.getenv("ZAP_HOST"))

DJANGO_SECRET_KEY = str(os.getenv("DJANGO_SECRET_KEY"))
DJANGO_DEBUG = bool(os.getenv("DJANGO_DEBUG"))
DJANGO_ALLOWED_HOSTS = str(os.getenv("DJANGO_ALLOWED_HOSTS"))
