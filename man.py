from bandit.core import manager
from bandit.core import config as bandit_config


path = '/maiglockchen'

config = {
    'targets': [path],
    'recursive': False,
    'exclude': None,
    'profile': None,
    'configfile': None,
    'output_format': 'json',
    'msg_template': None,
    'verbose': False,
    'debug': False,
    'print_steps': False,
    'ignore_nosec': False,
    'skip': None,
    'ini': None,
    'test_pattern': None,
    'report_filename': None
}



# Создание конфигурации Bandit
#bandit_conf = bandit_config.BanditConfig()

# Создание менеджера Bandit с передачей конфигурации и типа агрегации
manager = manager.BanditManager(config, agg_type="max")

# Запуск сканирования
results = manager.run_tests()
print(results)