FROM --platform=arm64 python:3.11.5-alpine3.17
EXPOSE 8000
WORKDIR /lilie
COPY . /lilie
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apk add --no-cache openjdk11-jre unzip
RUN pip3 install --no-cache-dir -r requirements.txt

#DependencyCheck
RUN wget https://github.com/jeremylong/DependencyCheck/releases/download/v8.3.1/dependency-check-8.3.1-release.zip
RUN unzip dependency-check-8.3.1-release.zip
RUN rm dependency-check-8.3.1-release.zip
ENV PATH=$PATH:/lilie/dependency-check/bin

RUN chmod +x entrypoint.sh
ENTRYPOINT ["/lilie/entrypoint.sh"]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
