"use client"
import { useState, useEffect } from "react";
import { BrowserProvider, Eip1193Provider } from "ethers";

declare global {
    interface Window {
        ethereum: Eip1193Provider & BrowserProvider 
    }
}

export default function Home() {
    const [account, setAccount] = useState('');
    const [network, setNetwork] = useState('');

    useEffect(() => {
        handleAccountsChanged();
        handleNetworkChanged();
        return () => {
            window.ethereum.removeAllListeners();
        }
    }, []);

    const connect = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account: string = accounts[0];
        setAccount(`${account.substring(0, 10)}...${account.substring(account.length - 10)}`);
    }

    const disconnect = async () => {
        setAccount('');
    }

    const handleAccountsChanged = async () => {
        window.ethereum.on('accountsChanged', (newAccount: string) => {
            newAccount = newAccount + ''
            setAccount(account);
        });
    }

    const addToken = async () => {
        try {
            const result = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: '0x0aBABf7Cd9De9508D1B69B2dd2d374fA88d384d3',
                        symbol: 'DAI',
                        decimals: 18,
                        image: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=022',
                    },
                },
            });
            if (result) {
                console.log('DAI token successfully added to wallet!');
            } else {
                throw new Error('Something went wrong.');
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const addNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x60',
                    chainName: 'Bitkub Chain',
                    nativeCurrency: {
                        name: 'BitKub Token',
                        symbol: 'KUB', // 2-6 characters long
                        decimals: 18,
                    },
                    rpcUrls: ['https://rpc.bitkubchain.io'],
                    blockExplorerUrls: ['https://bkcscan.com']
                }],
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    const nameNetwork: { [key: string]: string } = {
        "0x1": "Ethereum Mainnet",
        "0x3": "Ropsten Test Network",
        "0x4": "Rinkeby Test Network",
        "0x5": "Goerli Test Netwok",
        "0x60": "Bitkub Chain",
    }

    const handleNetworkChanged = async () => {
        window.ethereum.on('chainChanged', (chainId: string) => {
            console.log("Chain id: ", chainId);
            console.log("nameNetwork: ", nameNetwork);
            const selectNetwork = nameNetwork[chainId];
            console.log("Network: ", selectNetwork);
            setNetwork(selectNetwork);
        })
    }

    return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <div className="text-xl mb-4">Account: {account} </div>
            <div className="text-xl mb-4">Network: {network} </div>
            <button
                className="mt-4 mx-2 bg-green-500 text-white px-4 py-2 rounded"
                onClick={connect}>Login</button>
            <button
                className="mt-4 mx-2 bg-orange-500 text-white px-4 py-2 rounded"
                onClick={disconnect}>Logout</button>
            <button
                className="mt-4 mx-2 bg-indigo-500 text-white px-4 py-2 rounded"
                onClick={addToken}>Add token</button>
            <button
                className="mt-4 mx-2 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={addNetwork}>Add network</button>
        </div>
    </div>)
}