import React, {useContext, useEffect, useState} from 'react'

import {ethers} from 'ethers'

import {contractABI, contractAddress} from '../util/constants'

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = ()=>{
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider,
        signer,
        transactionContract
    })
    return transactionContract;
}

export const TransactionProvider = ({children})=> {

    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({
        addressTo:'',
        amount:'',
        message:''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [transactions, setTransactions] = useState([])

    const handleChange = (e, name)=> {
        setFormData((prevState)=> ({...prevState, [name]: e.target.value}))
    }

    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthereumContract();
    
            const availableTransactions = await transactionsContract.getAllTransactions();
    
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
    
            console.log(structuredTransactions);
    
            setTransactions(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };

    const checkIfTransactionsExists = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
    
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };

    const checkIfWalletIsConnected = async()=> {
        try {
            if(!ethereum) return alert("Please install metamask!");
            const accounts = await ethereum.request({method: 'eth_accounts'});
            if(accounts.length) {
                setCurrentAccount(accounts[0]);
                //getAllTransactions    
                getAllTransactions();
            } else {
                console.log('No account found')
            }
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum Object!")
        }
    }

    const connectWallet = async ()=> {
       
        console.log('connecting wallet...')
        try {
            if(!ethereum) return alert("Please install metamask!");
            const accounts = await ethereum.request({method:'eth_requestAccounts'});
            setCurrentAccount(accounts[0])
            console.log(currentAccount)
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum Object!")
        }
    }

    const sendTransaction = async ()=> {
        console.log('calling send transaction...')
        try {
            console.log('hello')
            if(!ethereum) return alert("Please install metamask!");
            const {addressTo,amount, message} = formData;
            const transactionContract = getEthereumContract();

            const parsedAmount = ethers.utils.parseEther(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params:[{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 gwei
                    value: parsedAmount._hex //0.00001
                }]
            });
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message)
            setIsLoading(true);
            console.log('Loading...', transactionHash)
            await transactionHash.wait()
            setIsLoading(false);
            console.log('Success...', transactionHash)
            const transactionsCount = await transactionContract.getTransactionCount()
            console.log(transactionsCount)
            setTransactionCount(transactionsCount.toNumber())
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum Object!")
        }
    }

    useEffect(()=> {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
    }, [transactionCount])
    return (
        <TransactionContext.Provider 
        value= {{ connectWallet, 
        currentAccount, 
        formData,
        handleChange, 
        sendTransaction,
        isLoading,
        transactionCount,
        transactions
        }}>
            {children}
        </TransactionContext.Provider>
    )
}