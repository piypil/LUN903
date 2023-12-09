import yaml
import os

data = {
    'env': {
        'contexts': [{
            'name': 'Default Context',
            'urls': [],
            'includePaths': [],
            'excludePaths': [],
            'authentication': {
                'parameters': {},
                'verification': {
                    'method': 'response',
                    'pollFrequency': 60,
                    'pollUnits': 'requests'
                }
            },
            'sessionManagement': {
                'method': 'cookie',
                'parameters': {}
            },
            'technology': {
                'exclude': []
            }
        }],
        'parameters': {
            'failOnError': True,
            'failOnWarning': False,
            'progressToStdout': True
        },
        'vars': {}
    },
    'jobs': [{
        'parameters': {
            'scanOnlyInScope': True,
            'enableTags': False,
            'disableAllRules': False
        },
        'rules': [],
        'name': 'passiveScan-config',
        'type': 'passiveScan-config'
    }, {
        'parameters': {},
        'name': 'spider',
        'type': 'spider',
        'tests': [{
            'onFail': 'INFO',
            'statistic': 'automation.spider.urls.added',
            'site': '',
            'operator': '>=',
            'value': 100,
            'type': 'stats',
            'name': 'At least 100 URLs found'
        }]
    }, {
        'parameters': {
            'maxDuration': 60,
            'maxCrawlDepth': 10,
            'numberOfBrowsers': 16,
            'inScopeOnly': True
        },
        'name': 'spiderAjax',
        'type': 'spiderAjax',
        'tests': [{
            'onFail': 'INFO',
            'statistic': 'spiderAjax.urls.added',
            'site': '',
            'operator': '>=',
            'value': 100,
            'type': 'stats',
            'name': 'At least 100 URLs found'
        }]
    }, {
        'parameters': {},
        'name': 'passiveScan-wait',
        'type': 'passiveScan-wait'
    }, {
        'parameters': {},
        'policyDefinition': {
            'rules': []
        },
        'name': 'activeScan',
        'type': 'activeScan'
    }, {
        'parameters': {
            'template': 'sarif-json',
            'reportDir': '/directory/',
            'reportFile': 'TargetProjectReport',
            'reportTitle': 'ZAP Scanning Report',
            'reportDescription': '',
            'displayReport': False
        },
        'risks': ['info', 'low', 'medium', 'high'],
        'confidences': ['falsepositive', 'low', 'medium', 'high', 'confirmed'],
        'sites': [],
        'name': 'report',
        'type': 'report'
    }]
}


class FullScanParserZAP:

    def __init__(self, url, project_directory, uuid):
        self.url = url
        self.project_directory = project_directory
        self.uuid = uuid

    def render_data(self):
        data['env']['contexts'][0]['name'] = self.url
        data['env']['contexts'][0]['urls'] = [self.url]
        
        # Обновляем путь к директории отчета в контейнере
        data['jobs'][-1]['parameters']['reportDir'] = f"/shared/project_scan/{self.uuid}"
        
        file_path = os.path.abspath(os.path.join(self.project_directory, "TargetProjectConfig.yaml"))
        with open(file_path, "w") as file:
            yaml.dump(data, file, sort_keys=False)
