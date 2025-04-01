'use client'

import { getMysolanadappProgram, getMysolanadappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useMysolanadappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getMysolanadappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getMysolanadappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['mysolanadapp', 'all', { cluster }],
    queryFn: () => program.account.mysolanadapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['mysolanadapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ mysolanadapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useMysolanadappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useMysolanadappProgram()

  const accountQuery = useQuery({
    queryKey: ['mysolanadapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.mysolanadapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['mysolanadapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ mysolanadapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['mysolanadapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ mysolanadapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['mysolanadapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ mysolanadapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['mysolanadapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ mysolanadapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
