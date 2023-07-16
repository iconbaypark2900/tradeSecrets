// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }
}

contract LendingContract {
    IERC20 public token;
    mapping(address => uint256) public deposits;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event Repayment(address indexed user, uint256 amount);

    constructor(IERC20 _token) {
        token = _token;
    }

    function deposit() external payable {
        deposits[msg.sender] += msg.value;
        require(token.transfer(msg.sender, msg.value), "Token transfer failed.");
        emit Deposit(msg.sender, msg.value);
    }

    function approve(address spender, uint256 amount) external {
        require(msg.sender != address(0), "Approve from the zero address");
        require(spender != address(0), "Approve to the zero address");

        // Call the approve function of the token contract
        token.approve(spender, amount);
    }

    function withdraw(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Not enough deposited");
        deposits[msg.sender] -= amount;
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed.");
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    
    // Repay loan
    function repayLoan(uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Not enough tokens deposited");
        
        // The transferFrom function is used here to move tokens from the user's
        // account to this contract's account. This represents the user paying
        // back their loan.
        token.transferFrom(msg.sender, address(this), amount);

        deposits[msg.sender] -= amount;

        // Emit Repayment event
        emit Repayment(msg.sender, amount);
    }
}
