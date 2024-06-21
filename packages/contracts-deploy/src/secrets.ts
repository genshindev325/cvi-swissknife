import { ethers } from 'ethers'

export const MNEMONIC = 'funny divide what march coast height stick assist autumn misery pelican gift'
export const MNEMONIC_PATH = `m/44'/60'/0'/0/3`
export const DEPLOYER_PRIVATE_KEY = ethers.Wallet.fromMnemonic(MNEMONIC, MNEMONIC_PATH).privateKey

export const ETHERSCAN_API_KEY = 'E51DAZ2C8W6EQ7XI14RD714A4S515PU4GY'
export const POLYGONSCAN_API_KEY = 'U9KASNUDDJ3XRMGE6UFKC3NC6V1XXD5BKQ'
export const ARBISCAN_API_KEY = '4BY7AVKQBDKQM3AQ528CIUF3VT8UJC7ADR'

export const DEFENDER_API_KEY = '8zh43nmnExA6xYqJrCAJeFkS9S6K4pvZ'
export const DEFENDER_API_SECRET = '5dB48TMhqw4cNSCXgZhcjoqUHJ9FPqEztTab6hRVw5B9ZFgcghC73oyJ18YUk92E'
