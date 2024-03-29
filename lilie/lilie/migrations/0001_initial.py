# Generated by Django 4.2.1 on 2023-11-19 14:15

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Files',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='project/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=255)),
                ('project_id', models.CharField(max_length=10)),
                ('file_hash', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='ScannedProject',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('project_name', models.CharField(default='Project', max_length=255)),
                ('url', models.URLField()),
                ('scan_date', models.DateTimeField(auto_now_add=True)),
                ('results', models.JSONField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ResultsSCA',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result_data', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lilie.files')),
            ],
        ),
        migrations.CreateModel(
            name='ResultsCodeQL',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result_data', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lilie.files')),
            ],
        ),
        migrations.CreateModel(
            name='ResultsBandit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('result_data', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='lilie.files')),
            ],
        ),
    ]
