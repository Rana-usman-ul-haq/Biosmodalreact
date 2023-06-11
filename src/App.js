import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import logo from './logo.svg';
import './App.css';
import Web3Modal from "web3modal";
import { useState, useEffect, useRef } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { abi } from './abi';
//const ethers = require("ethers")
import {ethers} from "ethers"

function App() {
const [isConnected, setIsConnected] = useState(false);
const [hasMetamask, setHasMetamask] = useState(false);
const [signer, setSigner] = useState(undefined);
const [amount, setAmount] = useState(0)

  let web3Modal  = useRef(null);;

  const providerOptions = {
    binancechainwallet: {
      package: true
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: { 56: "https://burned-morning-daylight.bsc.discover.quiknode.pro/3560832b130e449f1192fcdffbbe51102c73ec0c/" } // required
    }
  }

};

  useEffect(() => {
    if (typeof window !== "undefined") {
      web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions, // required
      });
    }
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect();
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        setSigner(provider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  async function execute() {
    if (typeof window.ethereum !== "undefined") {
      const contractAddress = "0x844C8fB29b76b6461993eaFC340d1057770d9464";
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        await contract.buyTokens({
          value: ethers.utils.parseEther(amount),
          gasLimit: 500000,
        });
        console.log("Done")
        alert("Tokens Bought!")
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }
  return (

    <div>
    {hasMetamask ? (
      isConnected ? (
        "Connected! "
      ) : (
        <button onClick={() => connect()}>Connect</button>
      )
    ) : (
      "Please install metamask"
    )}
   <input 
   width="100px"
   height="40px"
   type='number'
   value={amount}
   onChange={(event) => setAmount(event.target.value)}
   ></input>
    {isConnected ?<button onClick={() => execute()}>Buy Tokens</button> : ""}
  </div>

);
}

export default App;
