// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }
}

contract LendingContract {
    MyToken public token;
    mapping(address => uint256) public deposits;
    
    constructor(MyToken _token) {
        token = _token;
    }

    function deposit() external payable {
        deposits[msg.sender] += msg.value;
        token.transfer(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Not enough deposited");
        deposits[msg.sender] -= amount;
        token.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);
    }
}
