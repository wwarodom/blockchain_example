'use client'

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';


export default function TransferEther() {

    const [userAddress, setUserAddress] = useState(''); 
    const [transferAmount, setTransferAmount] = useState(''); 
    const [recipientAddress, setRecipientAddress] = useState(''); 
    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

    // Function to handle the Ethereum transfer
    const handleTransfer = async () => {
        try {
            // Check if MetaMask is installed and the user is connected
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider((window as any).ethereum);
                const signer = await provider.getSigner();

                // const senderAddress = await signer.getAddress();
                const amountInEther = parseFloat(transferAmount);

                if (!isNaN(amountInEther)) {
                    const amountInWei = ethers.parseEther(transferAmount);

                    // Send the transaction
                    const tx = await signer.sendTransaction({
                        to: recipientAddress, // Use recipient's address from state
                        value: amountInWei,
                    });

                    await tx.wait();

                    setTransactionStatus(`Transaction successful! TxHash: ${tx.hash}`);
                } else {
                    setTransactionStatus('Invalid amount');
                }
            } else {
                setTransactionStatus('MetaMask not installed or not connected');
            }
        } catch (error) {
            if (error instanceof Error)
                setTransactionStatus(`Transaction failed: ${error.name} ${error.message}`);
            else
                console.error('Error:', error);
        }
    };

    useEffect(() => {
        // Fetch the user's Ethereum address if available
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum
                .request({ method: 'eth_accounts' })
                .then((accounts: string[]) => {
                    if (accounts.length > 0) {
                        setUserAddress(accounts[0]);
                    }
                })
                .catch((error: Error) => {
                    console.error('Error fetching user address:', error);
                });
        }
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Ethereum Transfer</h1>
                
            {userAddress ? (
                <div>
                    <p>Your Ethereum Address: {userAddress}</p>

                    {/* Input field for recipient's address */}
                    <div className="mt-4">
                        <label htmlFor="recipientAddress" className="block font-medium mb-2">
                            Recipient's Ethereum Address:
                        </label>
                        <input
                            type="text"
                            id="recipientAddress"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="amount" className="block font-medium mb-2">
                            Amount to Transfer (Ether):
                        </label>
                        <input
                            type="text"
                            id="amount"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={handleTransfer}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            Transfer
                        </button>
                    </div>
                    {transactionStatus && (
                        <p className="mt-4 text-green-600">{transactionStatus}</p>
                    )}
                </div>
            ) : (
                <p>Please connect your MetaMask wallet to continue.</p>
            )}
        </div>
    );
}
