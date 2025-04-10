
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import { connection } from '../lib/constant'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import GameBuild from './Game';

export default function Gamepage() {
    const { publicKey, sendTransaction } = useWallet()
    const [balance, setBalance] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const formatAddress = (address) => {
        if (!address) return "";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    const formatBalance = (balance) => {
        if (balance === null) return "..."
        return `${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`
    }

    const fetchBalance = async (address) => {
        try {
            const pubKey = new PublicKey(address)
            const balance = await connection.getBalance(pubKey)
            setBalance(balance)
        } catch (error) {
            console.log(error)
        }
    }

    const requestAirdrop = async () => {
        if (!publicKey) return;
        
        setIsLoading(true);
        try {
            const signature = await connection.requestAirdrop(
                publicKey,
                LAMPORTS_PER_SOL 
            );
            await connection.confirmTransaction(signature);
            await fetchBalance(publicKey.toString());
        } catch (error) {
            console.error("Airdrop failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (publicKey) {
            fetchBalance(publicKey.toString())
            const interval = setInterval(() => fetchBalance(publicKey.toString()), 10000)
            return () => clearInterval(interval)
        }
    }, [publicKey])

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 text-white overflow-hidden relative">
           
            <div className="absolute w-full h-full overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                        key={i}
                        className="absolute bg-white opacity-10 rounded-full"
                        style={{
                            width: `${Math.random() * 200 + 50}px`,
                            height: `${Math.random() * 200 + 50}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 20 + 10}s infinite linear`
                        }}
                    />
                ))}
            </div>

            <div className="max-h-full w-full mx-auto px-4 relative z-10">
                <header className="py-6 border-b border-white border-opacity-20">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <h1 className="text-3xl font-bold mb-4 md:mb-0 text-yellow-400 drop-shadow-lg font-pixel">Fruity Slice</h1>
                        <div className="w-full md:w-auto">
                            {publicKey ? (
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="bg-black bg-opacity-40 rounded-lg p-3 w-full md:w-auto">
                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            <span className="text-gray-200">Wallet:</span>
                                            <span className="text-yellow-300">{formatAddress(publicKey.toString())}</span>
                                            <span className="text-gray-300 mx-1">|</span>
                                            <span className="text-gray-200">Balance:</span>
                                            <span className="text-yellow-300">{formatBalance(balance)}</span>
                                            <button
                                                className="ml-2 bg-green-600 hover:bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
                                                onClick={requestAirdrop}
                                                disabled={isLoading}
                                                title="Request Devnet SOL"
                                            >
                                                {isLoading ? '⌛' : '+'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <WalletMultiButton />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center md:justify-end">
                                    <WalletMultiButton />
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                
                <main className="py-8 max-h-96">
                    <GameBuild isWalletConnected={!!publicKey} sendTransaction={sendTransaction} />
                </main>
                
              
            </div>
            
            {/* CSS Animation Keyframes */}
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0) rotate(0); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                    100% { transform: translateY(0) rotate(360deg); }
                }
                
                .font-pixel {
                    font-family: 'Press Start 2P', monospace;
                    letter-spacing: 0.1em;
                }
            `}</style>
        </div>
    )
}