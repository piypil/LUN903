import sys
import pprint

from ast_scanner import Scanner
from solidity_parser.parser import parse_file, objectify

path = 'testSolidity/SWC_112.sol'
source_unit = parse_file(path, loc=True)
source_unit_object = objectify(source_unit, path)
scanner = Scanner(source_unit_object)

def check(scan: Scanner):
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
check(scanner)