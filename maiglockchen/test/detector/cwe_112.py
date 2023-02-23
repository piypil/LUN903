# detectors
# https://github.com/SonarSource/sonar-python/tree/master/python-frontend/src/main/java/org/sonar/plugins/python/api

import sys
sys.path.insert(1, '../core')
import ast_scanner
from solidity_parser.parser import parse_file, objectify

path = 'THIS'
source_unit = parse_file(path, loc=True)
source_unit_object = objectify(source_unit, path)
scanner = ast_scanner.Scanner(source_unit_object)

rulekey ="S000112"

def check(scan: ast_scanner.Scanner):
    for function in scan.functions:
        if "onlyOwner" in function.modifiers:
            continue
        print (function.functionObject.visibility)
        if not (
                "external" == function.functionObject.visibility
                or "public" in function.functionObject.visibility
            ):
                continue
        for functionCall in function.functionCalls:
            if functionCall.name != "delegatecall":
                continue
            if not hasattr(functionCall, "expression"):
                continue
            address = functionCall.expression.name
            if address in function.functionObject.declarations.keys():
                if function.functionObject.declarations[address].type == "Parameter":
                    print(scan.fileName)
                    print(functionCall.loc)
                    print(function.functionObject.declarations[address].loc)