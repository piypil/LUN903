# LUN903

<p align="center">
	<img src="/frontend/src/assets/images/logo_page.png" height="300px"/>
</p>


## Общее 
Данный проект объединяет инструменты статического тестирования безопасности приложений (SAST),  динамического тестирования безопасности приложений (DAST)  и анализа компонентов программного обеспечения (SCA) с открытым исходным кодом в одну систему комплексного анализа уязвимостей. Основная цель данной разработки это обучение. Грамотная настройка и владение инструментарием тестирования безопасности приложений (AST). 

Главное меню:
<p align="center">
	<img src="/docs/diagrams/png/Image1LUN903.png" height="300px"/>
</p>

Результаты SAST:
<p align="center">
	<img src="/docs/diagrams/png/Image2LUN903.png" height="300px"/>
</p>

## Инструменты
- **SAST:** Bandit (Python), CodeQL 
- **DAST:** OWASP ZAP (Zed Attack Proxy)
- **SCA:** OWASP Dependency-Check, OWASP Dependency-Track

Общая схема работы проекта:
<p align="center">
	<img src="/docs/diagrams/png/Image5LUN903.png" height="300px"/>
</p>

Общая схема работы проекта (Инструменты):
<p align="center">
	<img src="/docs/diagrams/png/Image3LUN903.png" height="300px"/>
</p>

## Возможный запуск
Тестироваине проводилось только на Ubuntu 22.04
    
    $ git clone https://github.com/piypil/LUN903.git
    $ cd LUN903/docker
    $ docker-compose up

## Итог

<p align="center">
	<img src="/docs/diagrams/png/Image4LUN903.png" height="300px"/>
</p>