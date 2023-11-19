import os

from django.conf import settings

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')

app.config_from_object('django.conf:settings', namespace="CELERY")

app.conf.broker_url = settings.CELERY_BROKER_URL

app.autodiscover_tasks()
