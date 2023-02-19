import sys
import pprint

from solidity_parser import parser

sourceUnit = parser.parse_file('testSolidity/Lessons.sol', loc=False)
pprint.pprint(sourceUnit)