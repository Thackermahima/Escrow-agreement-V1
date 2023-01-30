import logo from "./logo.svg";
import "./App.css";
import web3Modal from "web3modal";
import React, { useState, useEffect, useRef } from "react";
import {
  ESCROW_AGREEMENT_CONTRACT_ADDRESS,
  ESCROW_AGREEMENT_CONTRACT_ABI,
} from "./constants";
import { Contract, ethers, providers } from "ethers";
function App() {
  const [agreementId, setAgreementId] = useState(0);
  const [serviceProvider, setServiceProvider] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [amount, setAmount] = useState();
  const [amountReleased, setAmountReleased] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [totalAgreementCount, setTotalAgreementCount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isLoadingAgreements, setLoadingAgreements] = useState(false);
  const [isLoadingRelease, setLoadingRelease] = useState(false);
  const [isLoadingCancel, setLoadingCancel] = useState(false);

  const [allAgreements, setAllAgreements] = useState([]);
  const web3ModalRef = useRef();
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.log(error, "Error from connectWallet");
    }
  };
  const _createAgreement = async () => {
    try {

      if (agreementId == null && clientAddress == null) {
        alert("Please enter valid fields");
      }
      const signer = await getProviderOrSigner(true);
      const contract = await getEscrowContractInstance(signer);
      const tx = await contract.createEscrowAgreement(
        serviceProvider,
        agreementId,
        clientAddress,
        { value: ethers.utils.parseEther(amount) }
      );
      setLoadingAgreements(true);
      await tx.wait();
      setAgreementId("");
      setAmount(0);
      setAmountReleased(false);
      setLoadingAgreements(false);
      alert("Escrow agreement created successfully.");
    } catch (error) {
      console.log(error, "Error from _createAgreement");
    }
  };

  const _releaseFunds = async (agreementid) => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(agreementid);
      if (amountReleased == true) {
        alert("There is no fund to release!");
      }
      const signer = await getProviderOrSigner(true);
      console.log(signer)
      const contract = await getEscrowContractInstance(signer);
      const tx = await contract.releaseFunds(agreementid);
      setLoadingRelease(true);
      await tx.wait();
      setLoadingRelease(false);
      alert("Amount is released successfully!")
      setAmountReleased(true);
    } catch (error) {
      console.log(error, "Error from _releaseFunds");
    }
  };

  const _cancelFunds = async (id) => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = await getEscrowContractInstance(signer);

      const tx = await contract.cancel(id);
      setLoadingCancel(true);
      await tx.wait();
      setLoadingCancel(false);
      setCancelled(true);
      alert("Amount is cancelled successfully!");
      console.log("Cancelled successfully");
    } catch (error) {
      console.log(error, "Error from _cancelFunds");
    }
  };
  const getTotalNoOfAgreement = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = await getEscrowContractInstance(provider);
      const totalAgreements = await contract.totalAgreementCount();
      setTotalAgreementCount(totalAgreements);
    } catch(error) {
      console.log(error, "Error from getTotalNoOfAgreements");
    }
  };

const fetchAllAgreements = async() => {
  try {
    const provider = await getProviderOrSigner();
    const contract = await getEscrowContractInstance(provider);
    console.log(contract,"c");
    let agreements= await contract.returnAgreementList();
    let allEscrows = [];
    allEscrows.push(agreements);
    setAllAgreements(allEscrows);
    console.log(allEscrows,"a");
  } catch (error) {
    console.log(error,"Error fetchAllAgreements");
  }
}

  useEffect(() => {
    fetchAllAgreements();
  }, []);

  const getEscrowContractInstance = async (providerOrSigner) => {
    return new Contract(
      ESCROW_AGREEMENT_CONTRACT_ADDRESS,
      ESCROW_AGREEMENT_CONTRACT_ABI,
      providerOrSigner
    );
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet().then(async () => {
        await getTotalNoOfAgreement();
      });
    }
  }, [walletConnected]);
  const getProviderOrSigner = async (needSigner) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const signerr = await web3Provider.getSigner();
    const address = await signerr.getAddress();
    setClientAddress(address);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Please switch to the Goerli network!");
      throw new Error("Please switch to the goerli network");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  return (
    <div className="main">
      <div>
        <h1 className="title">Welcome to the escrow app</h1>
        {!walletConnected ? (
          <button onClick={connectWallet} className="button">
            Connect wallet
          </button>
        ) : (
          <button className="button">Connected</button>
        )}
        <br />
        <input
          className="input"
          placeholder="Enter service provider's address"
          onChange={(e) => setServiceProvider(e.target.value)}
        />
        <br />
        <input
          className="input"
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
        />
        <br />
        <input
          className="input"
          placeholder="Enter agreement Id"
          onChange={(e) => setAgreementId(e.target.value)}
        />
        {isLoadingAgreements ? (
          <button className="button1">Loading..</button>
        ) : (
          <button className="button1" onClick={_createAgreement}>
            Create Agreement
          </button>
        )}
        <div>
         {
          allAgreements && allAgreements.map((e) => {
            return(
              e.map((es) => {
              console.log(es,"ess");
              const id = es.agreementId.toString();

              return (
                <div className="divie">
                <p>AgreementId : {es.agreementId.toString()}</p>
              <p>Client Id : {es.client}</p> 
              <p>Service Provider : {es.serviceProvider}</p> 
              <p>Amount : {ethers.utils.formatEther(es.amount.toString())}</p> 
            
              {isLoadingRelease ? (
          <button className="button3">Loading..</button>
        ) : (
  <button onClick={() => {_releaseFunds(id)}} className="button2">Release</button>              
        )}
        {isLoadingCancel ? (
          <button className="button3">Loading..</button>
        ) : (
                <button onClick={() => {_cancelFunds(id)}} className="button3">Cancel</button>
                )}
                </div>
              );
            
            })
            )
            //console.log(e,"e");
           
            {/* console.log(e[0].agreementId.toString(),"agreementID");
            console.log(ethers.utils.formatEther(e[0].agreementId)); */}
              //console.log(eg,"map of e");
             
                     
          })
        }  
        </div>
        
      </div>
    {/* <div>
   
    </div> */}
    </div>
  );
}

export default App;