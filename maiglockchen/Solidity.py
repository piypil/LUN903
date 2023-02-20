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
        if not (
                "external" == function.functionObject.visibility
                or "public" in function.functionObject.visibility
            ):
                continue
check(scanner)