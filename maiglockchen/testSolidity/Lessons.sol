// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Demo {


    mapping (address => uint) public payments; //storage 

    function receiveFunds() public payable {
        payments[msg.sender] = msg.value;
    }
    
    address public myAdr = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    function transferTo(address tergetAdr, uint anmout) public {
        address payable _to  = payable(tergetAdr);
        _to.transfer(anmout);
    }

    function getBalance(address tergetAdr) public view returns(uint) {
        return tergetAdr.balance;
    }


    string public myStr = "test"; // storage 

    function demo() public {
        string memory myTempStr = "temp";
    }
}