import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract, ethers } from "ethers";
import { useEffect, useRef, useState } from "react";

import {abi as abi_Contract } from "../artifacts/contracts/Lock.sol/Lock.json";
import {bytecode as bytecode_Contract} from "../artifacts/contracts/Lock.sol/Lock.json";

export default function Home() {
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);

  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  // Used to store deployed contract address
  //const { ContractAddress, setContractAddress } = useContractAddress()
  const [ContractAddress, setContractAddress] = useState("");


  const deploycontracts = async () => {
    try {
        console.log("here");

        // We need a Signer here since this is a 'write' transaction.
        const signer = await getProviderOrSigner(true);

        var Contracts = new ethers.ContractFactory(abi_Contract, bytecode_Contract, signer);
        var deployed_Contract = await Contracts.deploy(2234256346373462);
        await deployed_Contract.deployTransaction.wait();
        setContractAddress(deployed_Contract.address);

        setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  





  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Goerli network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 97) {
      window.alert("Change the network to BNB Testnet");
      throw new Error("Change network to BNB Testnet");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);


    } catch (err) {
      console.error(err);
    }
  };

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (walletConnected) {
    if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
            <div>
                <div>
          <button onClick={deploycontracts} className={styles.button}>
            Deploy
          </button>
          </div>
          Contract Deployed at: {ContractAddress}
          </div>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        //network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Boilerplate Hardhat</title>
        <meta name="description" content="Boilerplate-Hardhat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Modify the boilerplate</h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            The boiler plate uses harhart enviroment and ether.js for interacting with the blockchain
          </div>
          <div className={styles.description}>
            Click to Deploy the Sample contract
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Not for production purposes
      </footer>
    </div>
  );
}