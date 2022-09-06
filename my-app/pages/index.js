import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css'
import Web3Modal from "web3Modal";
import { Contract, providers } from "ethers";
import { abi, WHITELIST_CONTRACT_ADDRESS } from '../constants';

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [numOfWitelisted, setNumOfWhitelisted] = useState(0);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    try{
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      const {chainId} = await web3Provider.getNetwork();
      if(chainId != 4)
      {
        window.alert("Please change the network to Rinkeby");
        throw new Error("Please change the network to Rinkeby");
      }
      if(needSigner)
      {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    }
    catch(err)
    {
      console.error(err);
    }
  }

  const addAddressToWhitelist = async () => {
    try{
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    }
    catch(err)
    {
      console.error(err);
    }
  }

  const getNumberOfWhitelisted = async () => {
    try{
      const provider = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _numOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumOfWhitelisted(_numOfWhitelisted);
    }
    catch(err)
    {
      console.error(err);
    }
  }

  const checkIfAddressIsWhitelisted = async () => {
    try{
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whiteListedAddresses(address);
      setJoinedWhitelist(_joinedWhitelist);
    }
    catch(err)
    {
      console.error(err);
    }
  }

  const connectWallet = async () => {
    try{
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    }
    catch(err)
    {
      console.error(err);
    }
  }
  
  const renderButton = () => {
    if(walletConnected)
    {
      if(joinedWhitelist)
      {
        <div className={styles.description}>
          Thanks for joining Whitelist!
        </div>
      }
      else if(loading)
      {
        <button className={styles.button}>Loading...</button>
      }
      else
      {
        return(
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    }
    else
    {
      <button onClick={connectWallet} className={styles.button}>
        Connect your Wallet
      </button>
    }
  }

  useEffect(() => {
    if(!walletConnected)
    {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disabledInjectedProvider: false
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title> Whitelist dApp </title>
        <meta name="description" content="Whitelist-Dapp" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numOfWitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
