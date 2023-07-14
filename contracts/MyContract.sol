// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    string public myString;

    function setMyString(string memory _myString) public {
        myString = _myString;
    }
}
