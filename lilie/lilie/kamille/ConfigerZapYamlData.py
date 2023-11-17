import yaml
from pprint import pprint

with open("../zap_configs/full_scan_zap.yaml", "r") as file:
    data = yaml.safe_load(file)

pprint(data)