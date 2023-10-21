'use client'

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Ballot1ABI from '../../contract/abi/Ballot1.json';

const contractAddress = '0xc0452684eBB39D6b68c04FDcE47E7c7c910e1d2C'; // Replace with the actual contract address

const getSigner = async () => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    return await provider.getSigner(); 
}

const getContract = async () => {
    return new ethers.Contract(contractAddress, Ballot1ABI, await getSigner());
}
 
export default function Home() {
  const [proposals, setProposals] = useState<string[]>([]);
  const [selectedProposal, setSelectedProposal] = useState('');
  const [winner, setWinner] = useState('');

  useEffect(() => {
    async function fetchProposals() {
      const ballotContract = await getContract();
      const numProposals = Number(await ballotContract.numProposals()); 
      const proposalNames = await Promise.all(
        Array.from({ length: numProposals }).map((_, i) =>
          ballotContract.proposalNames(i)
        )
      );
      setProposals(proposalNames);
    }
    fetchProposals();
  }, []);

  async function vote() {
    try {
      const ballotContract = await getContract();  
      const proposalIndex = proposals.indexOf(selectedProposal);
      await ballotContract.vote(proposalIndex);
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  }

  async function getWinner() {
    try {
      const ballotContract = await getContract();  
      const winningProposalIndex = await ballotContract.winningProposal();
      const winnerName = await ballotContract.winnerName();
      setWinner(proposals[winningProposalIndex]);
      alert(`The winner is: ${winnerName}`);
    } catch (error) {
      console.error('Error fetching winner:', error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Ballot1 Smart Contract</h1>
        <p>Select your proposal:</p>
        <select
          value={selectedProposal}
          onChange={(e) => setSelectedProposal(e.target.value)}
          className="border p-2 mx-2"
        >
          <option value="">Choose a proposal</option>
          {proposals.map((proposal) => (
            <option key={proposal} value={proposal}>
              {proposal}
            </option>
          ))}
        </select>
        <button onClick={vote} className="mt-4 mx-2 bg-blue-500 text-white px-4 py-2 rounded">
          Vote
        </button>
        <button onClick={getWinner} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Get Winner
        </button>
        {winner && <p className="mt-4">The winner is: {winner}</p>}
      </div>
    </div>
  );
}
