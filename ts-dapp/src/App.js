import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import MyToken from 'contracts/MyToken.json';
import LendingContract from 'contracts/LendingContract.json';

function App() {
  const [account, setAccount] = useState("");
  const [token, setToken] = useState();
  const [lendingContract, setLendingContract] = useState();

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const tokenAddress = MyToken.networks[window.ethereum.networkVersion].address;
      const lendingContractAddress = LendingContract.networks[window.ethereum.networkVersion].address;

      const tokenContract = new ethers.Contract(tokenAddress, MyToken.abi, signer);
      const lendingContractInstance = new ethers.Contract(lendingContractAddress, LendingContract.abi, signer);

      setToken(tokenContract);
      setLendingContract(lendingContractInstance);
    } else {
      window.alert("Please install MetaMask!");
    }
  }

  async function depositEth(amount) {
    try {
      if (lendingContract && account && amount) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);
        const amountWei = ethers.utils.parseEther(amount.toString());
        
        if (balance.lt(amountWei)) {
          throw new Error(`Insufficient balance. You have ${ethers.utils.formatEther(balance.toString())} ETH.`);
        }
  
        const depositTx = await lendingContract.deposit({ value: amountWei });
        await depositTx.wait();
      } else {
        throw new Error("Contract not initialized, account not set or invalid amount");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function withdrawEth(amount) {
    try {
      if (lendingContract && account && amount) {
        const amountWei = ethers.utils.parseEther(amount.toString());
        const withdrawTx = await lendingContract.withdraw(amountWei);
        await withdrawTx.wait();
      } else {
        throw new Error("Contract not initialized, account not set or invalid amount");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function repayLoan(amount) {
    try {
      if (lendingContract && account && amount) {
        const amountWei = ethers.utils.parseEther(amount.toString());
        const repayTx = await lendingContract.repayLoan(amountWei);
        await repayTx.wait();
      } else {
        throw new Error("Contract not initialized, account not set or invalid amount");
      }
    } catch (err) {
      console.error(err);
    }
  }
  

  return (
    <div>
      <h1>Hello, Blockchain!</h1>
      <p>Your account: {account}</p>
      <button onClick={() => depositEth(1)}>Deposit 1 ETH</button>
      <button onClick={() => withdrawEth(1)}>Withdraw 1 ETH</button>
      <button onClick={() => repayLoan(1)}>Repay Loan</button>
    </div>
  );
}

export default App;
