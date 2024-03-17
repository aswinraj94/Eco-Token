import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract, ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthersExtension } from "@dynamic-labs/ethers-v5";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";


import {abi as abi_Contract } from "../artifacts/contracts/Lock.sol/Lock.json";
import {bytecode as bytecode_Contract} from "../artifacts/contracts/Lock.sol/Lock.json";

export default function Home() {
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


  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
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
          Your Eco token balance: {ContractAddress}
          </div>
        );
      }
  };

  return (
    <div>
      <Head>
        <title>Boilerplate Hardhat</title>
        <meta name="description" content="Boilerplate-Hardhat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DynamicContextProvider
        settings={{
          environmentId: "ecefa76e-d7ea-4c98-9b5e-5e32a8d560d9",
          walletConnectorExtensions: [EthersExtension],
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <DynamicWidget />
      </DynamicContextProvider>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Eco Token</h1>
          <div className={styles.description}>
            {/* Using HTML Entities for the apostrophe */}
            Click to check your Eco token balance
          </div>
          <div className={styles.description}>
            Click to Deploy the Sample contract
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./EcoTokenLogo.png" />
        </div>
      </div>

      <footer className={styles.footer}>
        Eco Friendly Services
      </footer>
    </div>
  );
}