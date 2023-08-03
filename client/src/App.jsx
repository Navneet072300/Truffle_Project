import React, { useState, useEffect } from "react";
import Web3 from "web3";
import Bank from "./contracts/bank.json";
const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    async function connectWeb3() {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.enable();
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
      } else {
        const localWeb3 = new Web3(
          new Web3.providers.HttpProvider("http://127.0.0.1:7545")
        );
        setWeb3(localWeb3);
      }
    }

    connectWeb3();
  }, []);

  useEffect(() => {
    async function templet() {
      const localWeb3 = new Web3.providers.HttpProvider(
        "http://127.0.0.1:7545"
      );

      const web3 = new Web3(localWeb3);
      const networkId = await web3.eth.net.getId();
      const contractAddress = Bank.networks[networkId];
      if (web3) {
        const smartContract = new web3.eth.Contract(
          Bank.abi,
          contractAddress.address
        );
        setContract(smartContract);
        showBalance(smartContract);
      }
    }
    templet();
  }, [web3]);

  const Connect = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.enable();
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
      } else {
        alert("MetaMask is not installed. Please install MetaMask to connect.");
      }
    } catch (error) {
      console.error("Error connecting to Web3 provider:", error);
    }
  };

  const deposit = async () => {
    try {
      if (contract) {
        const accounts = await web3.eth.getAccounts();
        await contract.methods
          .deposite_money(amount)
          .send({ from: accounts[0] });
        setAmount("");
        showBalance(contract);
      }
    } catch (error) {
      console.error("Error depositing:", error);
      alert(error.message);
    }
  };

  const withdraw = async () => {
    try {
      if (contract) {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.withdraw(amount).send({ from: accounts[0] });
        setAmount("");
        showBalance(contract);
      }
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert(error.message);
    }
  };

  const showBalance = async (contract) => {
    try {
      if (contract) {
        const balance = await contract.methods.getBalance().call();
        setBalance(balance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "coral",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "900px",
          padding: "40px",
          borderRadius: "5px",
          background: "white",
        }}
      >
        <h1
          style={{
            color: "black",
            padding: "2rem",
            fontSize: "40px",
            height: "40px",
          }}
        >
          This is My ATM
        </h1>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid black",
            marginBottom: "20px",
          }}
        />
        <p style={{ fontWeight: "bold", fontSize: "24px", height: "50px" }}>
          Balance: {balance}
        </p>
        <button
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "8px 16px",
            marginRight: "10px",
            borderRadius: "25px",
          }}
          onClick={Connect}
        >
          Connect
        </button>
        <button
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "8px 16px",
            marginRight: "10px",
            borderRadius: "25px",
          }}
          onClick={deposit}
        >
          Deposit
        </button>
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "8px 16px",
            borderRadius: "25px",
          }}
          onClick={withdraw}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default App;
