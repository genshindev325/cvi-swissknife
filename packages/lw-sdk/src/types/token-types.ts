import type { TransactionReceipt } from '@ethersproject/providers'
import type { BigNumber, BigNumberish, Overrides, Signer } from 'ethers'
import type { ERC20 } from '@coti-cvi/auto-generated-code/contracts'

export type ArmadilloSupportedPair = {
  tokenName1: ArmadilloSupportedTokenName
  tokenName2: ArmadilloSupportedTokenName
}

export const IL_TOKEN_NAME_ORDER: Record<ArmadilloSupportedTokenName, number> = {
  WBTC: 10,
  WETH: 9,
  MATIC: 8,
  LINK: 7,
  BNB: 6,
  UNI: 1,
  SAND: 1,
  DOGE: 1,
  SHIB: 1,
  BAT: 1,
  GOVI: 1,
  ADA: 1,
  USDC: -100,
  USDT: -100,
  DAI: -100,
}

export enum TokenName {
  USDC = 'USDC',
  USDT = 'USDT',
  ETH = 'ETH',
  WETH = 'WETH',
  DAI = 'DAI',
  LINK = 'LINK',
  WBTC = 'WBTC',
  MATIC = 'MATIC',
  WMATIC = 'WMATIC',
  UNI = 'UNI',
  SAND = 'SAND',
  DOGE = 'DOGE',
  SHIB = 'SHIB',
  BAT = 'BAT',
  GOVI = 'GOVI',
  ADA = 'ADA',
  BNB = 'BNB',
  CVI = 'CVI',
  CVOL = 'CVOL',
  T_CVI_LP = 'T-CVI-LP',
  T_CVOL_LP = 'T-CVOL-LP',
}

export enum StakedTokenName {
  THETA_VAULT,
  ES_GOVI,
  GOVI,
}

export enum Vester {
  GOVI = 'GOVI',
  THETA = 'THETA',
}

export enum ArmadilloSupportedTokenName {
  USDC = 'USDC',
  USDT = 'USDT',
  WETH = 'WETH',
  DAI = 'DAI',
  LINK = 'LINK',
  WBTC = 'WBTC',
  MATIC = 'MATIC',
  UNI = 'UNI',
  SAND = 'SAND',
  DOGE = 'DOGE',
  SHIB = 'SHIB',
  BAT = 'BAT',
  GOVI = 'GOVI',
  ADA = 'ADA',
  BNB = 'BNB',
}

export const tokenDecimals: Record<TokenName, number> = {
  [TokenName.USDC]: 6,
  [TokenName.USDT]: 6,
  [TokenName.ETH]: 18,
  [TokenName.WETH]: 18,
  [TokenName.DAI]: 18,
  [TokenName.LINK]: 18,
  [TokenName.WBTC]: 8,
  [TokenName.MATIC]: 18,
  [TokenName.WMATIC]: 18,
  [TokenName.UNI]: 18,
  [TokenName.GOVI]: 18,
  [TokenName.ADA]: 18,
  ///////////////////////////
  [TokenName.SAND]: 9000,
  [TokenName.DOGE]: 9000,
  [TokenName.SHIB]: 9000,
  [TokenName.BAT]: 9000,
  [TokenName.CVI]: 18,
  [TokenName.CVOL]: 18,
  [TokenName.T_CVI_LP]: 18,
  [TokenName.T_CVOL_LP]: 18,
  [TokenName.BNB]: 18,
}

export type SupportedDecimals = typeof tokenDecimals[keyof typeof tokenDecimals]

export type IERC20 = ERC20

export type ApproveOptions = { amount?: BigNumberish; force?: boolean }

export interface TokenInterface {
  fromNumber(num: number | string): BigNumber
  toNumber(bn: BigNumber): number
  getBalance(address: string): Promise<BigNumber>
  transfer(signer: Signer, to: string, amount: number, overrides?: Overrides): Promise<TransactionReceipt>
  approve(options: {
    signer: Signer
    to: string
    approveOptions?: ApproveOptions
    overrides?: Overrides
  }): Promise<TransactionReceipt | undefined>
  toString(amount: BigNumber): string
  balanceToString(account: string): Promise<string>
}
