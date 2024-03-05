'use client'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 bg-white rounded shadow-md mb-4">
                <h1 className="text-2xl font-bold mb-4 p-2">Web Frontend Integration Workshop</h1>

                <ul>
                    <li className="bg-indigo-100 rounded-xl 
                            m-4 p-2 text-center text-xl shadow-lg">
                        <Link href="/hello">
                            Hello
                        </Link> 
                    </li>
                    <li className="bg-indigo-100 rounded-xl 
                            m-4 p-2 text-center text-xl shadow-lg">
                        <Link href="/vote">
                            Vote
                        </Link> 
                    </li>
                    <li className="bg-indigo-100 rounded-xl 
                            m-4 p-2 text-center text-xl shadow-lg">
                        <Link href="/wallet">
                            Wallet
                        </Link> 
                    </li>
                    <li className="bg-indigo-100 rounded-xl 
                            m-4 p-2 text-center text-xl shadow-lg">
                        <Link href="/ether">
                            Ether Transfer
                        </Link> 
                    </li>
                    <li className="bg-indigo-100 rounded-xl 
                            m-4 p-2 text-center text-xl shadow-lg">
                        <Link href="/token">
                        Token Management
                        </Link> 
                    </li>
                </ul>
            </div>
        </div>
    )
}