import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import MyContract from './build/contracts/MyContract.json'; // Path to your contract's JSON file

function App() {
  const [account, setAccount] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    // Check that the browser has an Ethereum provider (MetaMask, etc.)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      // Set the contract address and ABI
      const contractAddress = "your-contract-address-here"; // Replace with your contract's address
      const contractABI = MyContract.abi; // ABI from import statement

      // Create a new ethers Contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      // Now, you can call functions on your contract
      // For example, if your contract has a function called 'getMyString':
      // const myString = await contract.getMyString();
    } else {
      window.alert("Please install MetaMask!");
    }
  }

  return (
    <div>
      <h1>Hello, Blockchain!</h1>
      <p>Your account: {account}</p>
    </div>
  );
}

export default App;

