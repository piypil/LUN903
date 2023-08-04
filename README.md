# StiefmÜtterchen

<p align="center">
	<img src="/frontend/src/assets/images/logo_page.png" height="300px"/>
</p>


This project is a set of tools for securing web applications. The project includes the following tools:
- Static analysis of code security (SAST) - tools to find vulnerabilities in the source code of an application.
- Dynamic Code Security Analysis (DAST) - tools to find vulnerabilities in a running web application.
- Machine learning - using machine learning algorithms to automatically search for vulnerabilities.

Problems of SAST analysis:
- Limited support for programming languages.
- Frequent false positives of analysis tools.
- Insufficient accuracy of vulnerability detection.

Solving SAST analysis problems:
- Using open platforms to analyze more programming languages.
- Correlation with other security analysis tools, such as DAST, to improve vulnerability detection accuracy.
- Using machine learning to automatically detect vulnerabilities.

Tools used
SAST: Bandit 1.7.4, ESLint.
DAST: ZAP (Zed Attack Proxy).


## PostgreSQL installation on Ubuntu

    $ sudo apt update
    $ sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nodejs npm
    $ sudo -u postgres psql

    CREATE DATABASE stiefmutterchen;
    CREATE ROLE admin WITH PASSWORD 'password';
    ALTER ROLE admin WITH LOGIN;
    ALTER ROLE admin SET client_encoding TO 'utf8';  
    ALTER ROLE admin SET default_transaction_isolation TO 'read committed';  
    ALTER ROLE admin SET timezone TO 'UTC';
    ALTER DATABASE stiefmutterchen OWNER TO admin;
    GRANT ALL PRIVILEGES ON DATABASE stiefmutterchen TO admin;
    \q

Copy the content of the example env file that is inside the env_config.env into a .env file

## Installation

    $ git clone https://github.com/piypil/stiefmutterchen.git
    $ cd stiefmutterchen

### Virtual Environment (`venv`)

    $ sudo apt install python3-venv
    $ python3 -m venv env
    $ . env/bin/activate
    $ pip install -r requirements.txt

### Running the project
    $ cd stiefmutterchen/lilie
    $ python3 manage.py makemigrations core 
    $ python3 manage.py migrate
    $ python3 manage.py runserver

### Frontend

    $ cd stiefmutterchen/frontend
    $ npm i
    $ npm start

