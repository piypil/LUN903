FROM --platform=arm64 python:3.11.5-alpine3.17
EXPOSE 8000
WORKDIR /lilie

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /lilie
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /lilie
RUN chmod +x entrypoint.sh
ENTRYPOINT ["/lilie/entrypoint.sh"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
