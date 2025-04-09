import { useWallet } from "@solana/wallet-adapter-react"
import { use, useRef } from "react"
import { useState } from "react"



const BACKEND_URL=process.env.VITE_BACKEND || "http://localhost:3001"


const Game = ({isWalletConnected=false,sendTransaction}) => {

  const [gamestate,setgamestate]=useState({
    score:0,
    lives:3,
    isPlaying:false
  })

  const [copystatus,setcopystatus]=useState({house:false,contract:false})
  const [isProcessing,setIsProcessing]=useState(false)
  const [rewardstatus,setrewardStaus]=useState({loading:false,success:false,error:null})
   const {publickey,signMessage}=useWallet()
  const [currentscreen,setcurrentscreen]=useState('start')
   

  const cnavasRef=useRef(null)
  const gameinstanceRef=useRef(null) 
  const animationRef=useRef(null)

  const HOUSE_ADDRESS=""
  const CONTRACT_ADDREDD=""

  const formatAddress=(address)=>{
     if (!address ) return "" 
     return `${address.toString().slice(0,6)}...${address.toString().slice(-4)}`
  }

  const copyToClipboard=async(text,type)=>{
    try {
      await navigator.clipboard.writeText(text) ;
      setcopystatus(prev=>({
        ...prev,[type]:true
      }) )
      setTimeout(()=>{
        setcopystatus(prev=> ({
          ...prev,[type]:false
        }))
      },2000)
         
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="text-amber-300">gmae</div>
  )
}

export default Game