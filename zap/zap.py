import time
import logging

from pprint import pprint
from zapv2 import ZAPv2

# Config logger
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(message)s',
    filename='zap.log',
    filemode='w'
)


target = 'https://public-firing-range.appspot.com'
apiKey = '8cc4fb02-19d2-4348-a276-43c7f73ab822'
zap = ZAPv2(apikey=apiKey)

scanID = zap.spider.scan(target)
while int(zap.spider.status(scanID)) < 100:
    logging.info('Spider progress %: {}'.format(zap.spider.status(scanID)))
    time.sleep(1)

logging.debug('Spider has completed!')
print('\n'.join(map(str, zap.spider.results(scanID))))

scanID = zap.ajaxSpider.scan(target)

timeout = time.time() + 60*2   
while zap.ajaxSpider.status == 'running':
    if time.time() > timeout:
        break
    logging.info('Ajax Spider status' + zap.ajaxSpider.status)
    time.sleep(2)
ajaxResults = zap.ajaxSpider.results(start=0, count=10)



zap = ZAPv2(apikey=apiKey, proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

logging.info('Active Scanning target {}'.format(target))
scanID = zap.ascan.scan(target)
while int(zap.ascan.status(scanID)) < 100:
    logging.info('Scan progress %: {}'.format(zap.ascan.status(scanID)))
    time.sleep(5)

logging.debug('Active Scan completed')
logging.info('Hosts: {}'.format(', '.join(zap.core.hosts)))
logging.warning('Alerts: ')
pprint(zap.core.alerts(baseurl=target))