import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import MyContract from '../build/contracts/MyContract.json'; 
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
    if(lendingContract && amount) {
      const amountWei = ethers.utils.parseEther(amount.toString());
      const depositTx = await lendingContract.deposit({ value: amountWei });
      await depositTx.wait();
    } else {
      console.log("Error: contract not initialized or invalid amount");
    }
  }

  async function withdrawEth(amount) {
    if(lendingContract && amount) {
      const amountWei = ethers.utils.parseEther(amount.toString());
      const withdrawTx = await lendingContract.withdraw(amountWei);
      await withdrawTx.wait();
    } else {
      console.log("Error: contract not initialized or invalid amount");
    }
  }

  return (
    <div>
      <h1>Hello, Blockchain!</h1>
      <p>Your account: {account}</p>
      <button onClick={() => depositEth(1)}>Deposit 1 ETH</button>
      <button onClick={() => withdrawEth(1)}>Withdraw 1 ETH</button>
    </div>
  );
}

export default App;


