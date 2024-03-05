'use client'

import { useState } from 'react';
import Web3 from 'web3';
import HelloWorldABI from '../../contract/abi/HelloWorld.json';

// interface HelloWorldMethods {
//   [methodName: string]: (...args: any[]) => any;
// }

const contractAddress = '0xc771df8efdfd45f9b44a4461f06835d8266bcf49'; // Replace with the actual contract address

const web3 = new Web3((window as any).ethereum);
const helloWorldContract = new web3.eth
        .Contract(HelloWorldABI, contractAddress) as any;

export default function Home() {
  const [message, setMessage] = useState('');       // display message
  const [newMessage, setNewMessage] = useState(''); // text input message

  async function getMessage() {
    try {
      const message = await helloWorldContract.methods.message().call();
      setMessage(message);
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  }

  async function setInputMessage() {
    try {
      const accounts = await web3.eth.requestAccounts();
      await helloWorldContract.methods.updateMessage(newMessage).send({ from: accounts[0] });
      console.log("Message updated successfully!");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">HelloWorld Smart Contract</h1>
        <p>Current Message: <span className="text-blue-800">{message}</span></p>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 mx-2"
          placeholder="Enter new message"
        />
        <button onClick={getMessage} className="mt-4 mx-2 bg-blue-500 text-white px-4 py-2 rounded">Get Message</button>
        <button onClick={setInputMessage} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Set Message</button>
      </div>
    </div>
  );
}
