import type { NamedAccount } from './types'
import { generateNamedAccounts } from './constants'
import type { ChainId, TokenInterface } from '../types'
import { safeObjectEntries } from '../util'

export async function printBalances(tokens: TokenInterface[], accounts: string[], str?: string) {
  if (str) {
    console.log(str)
  }
  for (const account of accounts) {
    for (const token of tokens) {
      console.log(`[${account}] ${await token.balanceToString(account)}`)
    }
  }
}

export function getNamedAccountAddress({
  name,
  chainId,
  privateKey,
}: {
  name: NamedAccount
  chainId: ChainId
  privateKey?: string
}) {
  const res = generateNamedAccounts({ privateKey })[name]
  const address = typeof res === 'object' ? res[chainId] : res
  return typeof address === 'string' ? address : undefined
}

export function getNamedAccounts({
  chainId,
  privateKey,
}: {
  chainId: ChainId
  privateKey?: string
}): { name: NamedAccount; address: string }[] {
  const res = safeObjectEntries(generateNamedAccounts({ privateKey })).map(([name]) => ({
    name,
    address: getNamedAccountAddress({ name, chainId, privateKey }),
  }))
  const guard = (item: {
    name: NamedAccount
    address: string | undefined
  }): item is { name: NamedAccount; address: string } => !!item.address && item.address.length === 42
  return res.filter(guard)
}
