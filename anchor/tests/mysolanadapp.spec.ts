import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Mysolanadapp } from '../target/types/mysolanadapp'

describe('mysolanadapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Mysolanadapp as Program<Mysolanadapp>

  const mysolanadappKeypair = Keypair.generate()

  it('Initialize Mysolanadapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        mysolanadapp: mysolanadappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([mysolanadappKeypair])
      .rpc()

    const currentCount = await program.account.mysolanadapp.fetch(mysolanadappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Mysolanadapp', async () => {
    await program.methods.increment().accounts({ mysolanadapp: mysolanadappKeypair.publicKey }).rpc()

    const currentCount = await program.account.mysolanadapp.fetch(mysolanadappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Mysolanadapp Again', async () => {
    await program.methods.increment().accounts({ mysolanadapp: mysolanadappKeypair.publicKey }).rpc()

    const currentCount = await program.account.mysolanadapp.fetch(mysolanadappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Mysolanadapp', async () => {
    await program.methods.decrement().accounts({ mysolanadapp: mysolanadappKeypair.publicKey }).rpc()

    const currentCount = await program.account.mysolanadapp.fetch(mysolanadappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set mysolanadapp value', async () => {
    await program.methods.set(42).accounts({ mysolanadapp: mysolanadappKeypair.publicKey }).rpc()

    const currentCount = await program.account.mysolanadapp.fetch(mysolanadappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the mysolanadapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        mysolanadapp: mysolanadappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.mysolanadapp.fetchNullable(mysolanadappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
