pragma solidity ^0.4.23;

contract SimpleStorageSC {

    uint storedData;

    function setValue(uint _x) public {
        storedData = _x;
    }

    function getValue() public view returns (uint) {
        return storedData;
    }

}

