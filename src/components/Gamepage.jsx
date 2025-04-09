import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import { connection } from '../lib/constant'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Game from './Game';
export default function Gamepage() {

    const {publickey,sendTransaction}=useWallet()
    const [balance,setbalance]=useState()
    const [isLoading,setIsLoading]=useState(false)

    const formatAddress=(address)=>{
       if (!address) return "";

    }

    const formatbalance=(balance)=>{
        if(balance===null) return "..."
        return `${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`
    
    }

    const fetchBalance=async(address)=>{
      try {
       const publickey=await PublicKey(address)
       const balance=await connection.getBalance(publickey)
       setbalance(balance) 
      } catch (error) {
        console.log(error)
      }
    }


    useEffect(()=>{
        if(publickey){
            fetchBalance(publickey.toString())
            const interval=setInterval(()=> fetchBalance(publickey.toString()),10000)
            return () =>clearInterval(interval)
        }
    })
  return (
<div className='min-h-screen bg-gradient-to-b from-purple-600 to-blue-700 text-white overflow-hidden relative'>
    <div className=''>
    <WalletMultiButton></WalletMultiButton>
      <div >
        Balance {fetchBalance} is 
      </div>
    <Game></Game>
    </div>
</div>
  )
}

