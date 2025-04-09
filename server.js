import express from 'express';
import bs58 from "bs58"
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import jwt from "jsonwebtoken"
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import crypto from "crypto"
import { timeStamp } from 'console';

dotenv.config();

const app = express();
const connection=new Connection(process.env.RPC || "https://api.devnet.solana.com")

const TOKEN_MINT=new PublicKey("");
const PAYER=Keypair.fromSecretKey(bs58.decode(process.env.PAYER_WALLET));
const HOUSE_WALLET=PAYER.publicKey;
const JWT_SECRET=process.env.JWT_SECRET

const authtoken=process.env.AUTH_TOKEN;
const specialrewardClaimed=new Set()    //we store the address that claimed special rewards


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true, 
  legacyHeaders: false, 
});


const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Apply rate limiting to all routes
app.use(limiter);

function getSliceRewards(score,playerAddress){
    if(score >=1000 && !specialrewardClaimed.has(playerAddress)){
      specialrewardClaimed.add(playerAddress)
      return 50000
    }

    if(score < 20) return 0; 
    if (score < 40) return 500;
    if(score < 60) return 1000;
    if (score < 80 )  return 1500;
    if (score< 100 ) return 2000;
    if(score < 120) return 3000

    return 6000;


  
}

 

async function getorCreateAssociatedTokenAccount(){
  try {
    
  
  const associatedtoken=await getAssociatedTokenAddress(
    TOKEN_MINT,
    owner,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  )

  try {
    await connection.getTokenAccountBalance(associatedtoken)
    return associatedtoken

  } catch (error) {
const transaction=new Transaction().add(
  createAssociatedTokenAccountInstruction(
    PAYER_WALLET.publicKey,
    associatedtoken,
    owner,
    TOKEN_MINT,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  )
)

const signature=await connection.sendTransaction(transaction,[PAYER])
await connection.confirmTransaction(signature);
return associatedtoken
  }

}catch (error) {
   console.error("Error in get or create associatedaccount",error)
   throw error  
  }
}




app.post("/api/transfer-tokens",async (req,res)=>{
  

   try {
    const requesttokens=req.headers["authorization"]

    const token=requesttokens.split(" ")[1];


    if(!token){
      res.status(403).json({message:"not auth"})
      return
    }


    try {
      const decode=jwt.verify(token,JWT_SECRET)
      req.user=decode
    } catch (error) {
      res.status(403).json({message:"not valid auth"})
      return 
    }


    const {playerAddress,score}=req.body;

    if(!playerAddress || !score ){
      res.status.json({message:"player add not found"})
      return
    }

    const player=new PublicKey(playerAddress);
    const amount=getSliceRewards(score,playerAddress);

    
     if(amount <=0 ){
      res.status(400).json({error:"not have good score to recive the tokens "})
     } 
 
   // now we create player token account 
   const palyertokenAccount=await getorCreateAssociatedTokenAccount(player);
   const housetokenAccount=await getorCreateAssociatedTokenAccount(HOUSE_WALLET);


   //check the house wallet balance 

    const housewalletbalance=await connection.getTokenAccountBalance(housetokenAccount);
      if(housewalletbalance.value.uiAmount< amount){
        res.status(400).json({messge:"insuffcient funds"})
        return 
      }


      const transaction=await Transaction().add(
        createTransferInstruction(
          housetokenAccount,
          palyertokenAccount,
          owner,
          amount * 10 ** 6 

        )
      )

      transaction.feePayer=PAYER.publicKey;
      transaction.recentBlockhash=(await connection.getLatestBlockhash()).blockhash;

      const simulateResult=await connection.simulateTransaction(transaction);

      if(simulateResult.value.err){
        throw new Error(`transaction simulation failed ${simulateResult.value.err}`)
      }
      //now we send transaction 

      const signature=await connection.sendTransaction(transaction,[PAYER]);
      await connection.confirmTransaction(signature)


      res.json({
        success:true,
        signature,
        amount,
        message:`succesfully transferred ${amount} tokens to ${playerAddress}`
      })

   } catch (error) {
    console.error(`error transfering tokens`,error)
    res.status(500).json({
      error:"failed to tranfer token",
      details:error.message
    })
   }
})


const nouncestore=new Map()
const EXPIRY_TIME_NOUNCE=5 * 60 *1000;


app.post("/api/get-nounce",(req,res)=>{
  try {
    const requestauthtoken=req.headers["authorization"]

    if (!requestauthtoken  || requestauthtoken !== `Bearer ${authtoken}`){
      res.status(400).json({
        messgae:"error invalid auth"
      })
      return 
    }

    //generate a random nounce 

    const nounce= crypto.randomBytes(32).toString('hex')
    nouncestore.set(nounce,{
      timeStamp:Date.now(),
      used:false
    })
    


    for(const[storenounce,data] of nouncestore.entries()){
      if(Date.now() - data.timestamp > EXPIRY_TIME_NOUNCE){
        nouncestore.delete(storenounce)
      }
    }


    res.json({
      success:true,
      nounce,
      expiresin:EXPIRY_TIME_NOUNCE
    })
  } catch (error) {
    console.log(error)
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 