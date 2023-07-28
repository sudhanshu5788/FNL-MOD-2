import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [recipient, setRecipient] = useState(undefined);
  const [checkBalanceAddress, setCheckBalanceAddress] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }
  const deposit5 = async() => {
    if (atm) {
      let tx = await atm.deposit(5);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }
  const withdraw5 = async() => {
    if (atm) {
      let tx = await atm.withdraw(5);
      await tx.wait()
      getBalance();
    }
  }

  const checkBalance = async () => {
    if (!atm || !checkBalanceAddress) {
      console.error("Please provide an address to check balance.");
      return;
    }

    try {
      
      let userAddress = checkBalanceAddress.toLowerCase();
      let userBalance = await atm.getAccountBalance(userAddress);
      setBalance(userBalance.toNumber());
    } catch (error) {
      console.error("Error while checking balance:", error.message);
    }
  };

  const transfer = async (recipient, amount) => {
    if (atm) {
      try {
        let tx = await atm.transfer(recipient, amount);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error("Error while transferring:", error.message);
      }
    }
  };



  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={deposit5}>Deposit 5 ETH</button>
        <button onClick={withdraw5}>Withdraw 5 ETH</button><br></br>
        <input
          type="text"
          placeholder="Account Address"
          value={checkBalanceAddress}
          onChange={(e) => setCheckBalanceAddress(e.target.value)}
        />
        
        <button onClick={checkBalance}>Check Balance</button>
        <br></br>
        <input
        type="text"
        placeholder="Recipient Address"
        onChange={(e) => setRecipient(e.target.value)}
      />
    
      <button onClick={() => transfer(recipient, 1)}>Transfer 1 ETH</button>
      
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <h1>PROJECT MODULE 2</h1>
      <h2>WELCOME TO SUDHANSHU'S ATM</h2>

      {initUser()}
      <style jsx>{`

        .container {
          width: 70vw; 
          height: 55vh;
          margin: auto;
          background-color: #f0f0f0; 
          border: 2px solid #ccc; 
          border-radius: 5px; 
          display: flex;
          justify-content: center; 
          align-items: center;
          flex-direction: column;
          align-content: center;
        }
        h1 {
            font-family: "Arial", sans-serif;
            font-size: 48px;
            font-weight: bold;
            color: #0066cc;
        }
        h2 {
            font-family: "Cursive", Lucida Handwriting;
            font-size: 30px;
            font-weight: normal;
            color: #ff6600;
        }
      
      `}
      </style>
    </main>
  )
}
