"use client"

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MyTokenABI from '../../contract/abi/MyToken.json';

// Replace with the actual contract address
const contractAddress = '0x6d40C492e6887680652AfAeFEd78b41cA80A0E5F';

const getSigner = async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    return await provider.getSigner(); 
}

const getContract = async () => {
    return new ethers.Contract(contractAddress, MyTokenABI, await getSigner());
}

export default function TokenPage() {
    const [account, setAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [tokenBalance, setTokenBalance] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');

    async function mintToken() {
        if ( !account || !amount ){
            alert("Please fill Account and Amount"); 
            return ;
        }
        try {
            const myTokenContract = await getContract();
            await myTokenContract.mint(account, ethers.parseEther(amount));
            console.log('Tokens minted successfully!');
        } catch (error) {
            console.error('Error minting tokens:', error);
        }
    }

    async function burnToken() {
        if (!amount){
            alert("Please fill Amount"); 
            return ;
        }
        try {
            const myTokenContract = await getContract();
            await myTokenContract.burn(ethers.parseEther(amount));
            console.log('Tokens burned successfully!');
        } catch (error) {
            console.error('Error burning tokens:', error);
        }
    }

    async function transferToken() {
        if ( !account || !amount ){
            alert("Please fill Account and Amount"); 
            return ;
        }
        try {
            const myTokenContract = await getContract();
            await myTokenContract.transfer(account, ethers.parseEther(amount));
            console.log('Tokens transferred successfully!');
        } catch (error) {
            console.error('Error transferring tokens:', error);
        }
    }

    async function getTokenBalance() {
        if (!account) {
            alert("Please fill Account");
            return;
        }
        try {
            const myTokenContract = await getContract();
            const balance = await myTokenContract.balanceOf(account);
            setTokenBalance(balance.toString());
            console.log("Balance: ", balance)
        } catch (error) {
            console.error('Error getting token balance:', error);
        }
    }

    async function getTotalSupply() {
        try {
            const myTokenContract = await getContract();
            const supply = await myTokenContract.totalSupply();
            setTotalSupply(supply.toString().toLocaleString('en-US'));
        } catch (error) {
            console.error('Error getting total supply:', error);
        }
    }

    async function getTokenInfo() {
        try {
            const myTokenContract = await getContract();
            const tokenName = await myTokenContract.name();
            const tokenSymbol = await myTokenContract.symbol();
            setName(tokenName);
            setSymbol(tokenSymbol);
        } catch (error) {
            console.error('Error getting token info:', error);
        }
    }

    useEffect( () => {
        async function fetchData() {
            await getTokenInfo();
            await getTotalSupply()
        };
        fetchData();
    },[name, symbol])

    return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Token Interaction</h1>

            {tokenBalance && <p>Token Balance: {ethers.formatEther(tokenBalance)}</p>}
            {totalSupply && <p>Total Supply: {ethers.formatEther(totalSupply)}</p>}
            {name && <p>Token Name: {name}</p>}
            {symbol && <p>Token Symbol: {symbol}</p>} 

            <div className="mt-2">
                <label htmlFor="account" className="block">Account: </label>
                <input id="accont" type="text" className="block border w-full" value={account} onChange={(e) => setAccount(e.target.value)} />
            </div>
            <div>
                <label htmlFor="amount" className="block" >Amount: </label>
                <input id="amount" type="text" className="block border w-full" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <button onClick={mintToken} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Mint Token</button>
            <button onClick={burnToken} className="ml-2 bg-red-500 text-white px-4 py-2 rounded">Burn Token</button>
            <button onClick={transferToken} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">Transfer Token</button>
            <button onClick={getTokenBalance} className="ml-2 bg-yellow-500 text-white px-4 py-2 rounded">Balance</button>
        
        </div>
    </div>
    );
}