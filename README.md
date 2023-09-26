# LUN903

<p align="center">
	<img src="/frontend/src/assets/images/logo_page.png" height="300px"/>
</p>

This project is a set of tools for securing web applications. The project includes the following tools:
- Static analysis of code security (SAST) - tools to find vulnerabilities in the source code of an application.
- Dynamic Code Security Analysis (DAST) - tools to find vulnerabilities in a running web application.
- Machine learning - using machine learning algorithms to automatically search for vulnerabilities.

### Problems of SAST analysis
- Limited support for programming languages.
- Frequent false positives from analysis tools.
- Insufficient accuracy of vulnerability detection.

### Solving SAST analysis problems
- We are using open platforms to analyze more programming languages.
- Correlation with other security analysis tools, such as DAST, to improve vulnerability detection accuracy.
- Using machine learning to automatically detect vulnerabilities.

### Tools used
- **SAST:** Bandit (Python)
- **DAST:** OWASP ZAP (Zed Attack Proxy)
- **SCA:** OWASP Dependency-Check

## Installation on Ubuntu

    $ git clone https://github.com/piypil/LUN903.git
    $ cd LUN903
    $ chmod +x install.sh
    $ ./install.sh

## Running the project

### Backend 

    $ cd LUN903/lilie
    $ python3 manage.py runserver

### Frontend

    $ cd LUN903/frontend
    $ npm start
