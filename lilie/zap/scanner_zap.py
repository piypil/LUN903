import time
import json

from zapv2 import ZAPv2
from pprint import pprint
from core.models import ScannedProject

class OWASPZAPScanner:
    def __init__(self, zap_address, zap_port, api_key):
        self.zap = ZAPv2(apikey=api_key, proxies={'http': f'http://{zap_address}:{zap_port}', 'https': f'http://{zap_address}:{zap_port}'})

    def start_scan(self, url):
        scanned_project = ScannedProject.objects.create(url=url)
        
        scan_id_spider = self.zap.spider.scan(url)
        while int(self.zap.spider.status(scan_id_spider)) < 100:
            print('Scan progress %: {}'.format(self.zap.spider.status(scan_id_spider)))
            time.sleep(1)
            print('\n'.join(map(str, self.zap.spider.results(scan_id_spider))))

        print(scan_id_spider)
        scan_id_ajax = self.zap.ajaxSpider.scan(url)

        print(scan_id_ajax)

        timeout = time.time() + 60*2
        while self.zap.ajaxSpider.status == 'running':
            if time.time() > timeout:
                break
            print('Ajax Spider status' + self.zap.ajaxSpider.status)
            time.sleep(2)

        ajax_results = self.zap.ajaxSpider.results(start=0, count=10)
        pprint(ajax_results)

        scan_id_ascan = self.zap.ascan.scan(url)
        print(scan_id_ascan)
        while int(self.zap.ascan.status(scan_id_ascan)) < 100:
            print('Scan progress %: {}'.format(self.zap.ascan.status(scan_id_ascan)))
            time.sleep(5)

        alerts = self.zap.core.alerts()
        results_json = json.dumps(alerts)

        scanned_project.results = results_json
        scanned_project.save()