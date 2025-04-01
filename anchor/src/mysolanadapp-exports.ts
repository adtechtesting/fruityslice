// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import MysolanadappIDL from '../target/idl/mysolanadapp.json'
import type { Mysolanadapp } from '../target/types/mysolanadapp'

// Re-export the generated IDL and type
export { Mysolanadapp, MysolanadappIDL }

// The programId is imported from the program IDL.
export const MYSOLANADAPP_PROGRAM_ID = new PublicKey(MysolanadappIDL.address)

// This is a helper function to get the Mysolanadapp Anchor program.
export function getMysolanadappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...MysolanadappIDL, address: address ? address.toBase58() : MysolanadappIDL.address } as Mysolanadapp, provider)
}

// This is a helper function to get the program ID for the Mysolanadapp program depending on the cluster.
export function getMysolanadappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Mysolanadapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return MYSOLANADAPP_PROGRAM_ID
  }
}
