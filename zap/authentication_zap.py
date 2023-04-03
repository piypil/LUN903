#!/usr/bin/env python
import urllib.parse
from zapv2 import ZAPv2
import time
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    filename='zap.log',
    filemode='w'
)

context_id = 1
apikey = '8cc4fb02-19d2-4348-a276-43c7f73ab822'
context_name = 'NEW'
target_url = 'http://localhost:8881'

# By default ZAP API client will connect to port 8080
zap = ZAPv2(apikey=apikey, proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

# Use the line below if ZAP is not listening on port 8080, for example, if listening on port 8090
# zap = ZAPv2(apikey=apikey, proxies={'http': 'http://127.0.0.1:8090', 'https': 'http://127.0.0.1:8090'})


def set_include_in_context():
    include_url = 'http://localhost:8881.*'

    zap.context.include_in_context(context_name, include_url)

    zap.context.exclude_from_context(context_name, '\\Qhttp://localhost:8881/login.php\\E')
    zap.context.exclude_from_context(context_name, '\\Qhttp://localhost:8881/logout.php\\E')
    zap.context.exclude_from_context(context_name, '\\Qhttp://localhost:8881/setup.php\\E')
    zap.context.exclude_from_context(context_name, '\\Qhttp://localhost:8881/security.php\\E')
    print('Configured include and exclude regex(s) in context')


def set_logged_in_indicator():

    logged_in_regex = "\\Q<a href=\"logout.php\">Logout</a>\\E"
    logged_out_regex = "(?:Location: [./]*login\\.php)|(?:\\Q<form action=\"login.php\" method=\"post\">\\E)"

    zap.authentication.set_logged_in_indicator(context_id, logged_in_regex)
    zap.authentication.set_logged_out_indicator(context_id, logged_out_regex)
    print('Configured logged in indicator regex ')


def set_script_based_auth():
    post_data = "username={%username%}&password={%password%}" + "&Login=Login&user_token={%user_token%}"
    post_data_encoded = urllib.parse.quote(post_data)
    login_request_data = "scriptName=auth-dvwa.js&Login_URL=http://localhost:8881/login.php&CSRF_Field=user_token" \
                         "&POST_Data=" + post_data_encoded

    zap.authentication.set_authentication_method(context_id, 'scriptBasedAuthentication', login_request_data)
    print('Configured script based authentication')


def set_user_auth_config():
    user = 'Administrator'
    username = 'admin'
    password = 'password'

    user_id = zap.users.new_user(context_id, user)
    user_auth_config = 'Username=' + urllib.parse.quote(username) + '&Password=' + urllib.parse.quote(password)
    zap.users.set_authentication_credentials(context_id, user_id, user_auth_config)
    zap.users.set_user_enabled(context_id, user_id, 'true')
    zap.forcedUser.set_forced_user(context_id, user_id)
    zap.forcedUser.set_forced_user_mode_enabled('true')
    print('User Auth Configured')
    return user_id


def upload_script():
    script_name = 'auth-dvwa.js'
    script_type = 'authentication'
    script_engine = 'Oracle Nashorn'
    file_name = '/tmp/auth-dvwa.js'
    charset = 'UTF-8'
    zap.script.load(script_name, script_type, script_engine, file_name, charset=charset)


def start_spider(user_id):
    zap.spider.scan_as_user(context_id, user_id, target_url, recurse='true')
    print('Started Scanning with Authentication')
    print('\n'.join(map(str, zap.spider.results())))


set_include_in_context()
set_script_based_auth()
set_logged_in_indicator()
user_id_response = set_user_auth_config()
start_spider(user_id_response)