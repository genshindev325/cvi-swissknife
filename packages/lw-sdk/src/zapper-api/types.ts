import type { IArmadilloSupportedTokenName } from '../types'

export enum SupportedZapperProtocolNames {
  UNISWAP_V2 = 'uniswap-v2',
  DODO = 'dodo',
  SUSHISWAP = 'sushiswap',
  QUICKSWAP = 'quickswap',
}

export type ZapperProtocolName =
  | 'aave-amm'
  | 'aave-safety-module'
  | 'aave'
  | 'aave-v2'
  | 'aavegotchi'
  | 'abracadabra'
  | 'adamant'
  | 'alchemix'
  | 'alkemi'
  | 'alpha-tokenomics'
  | 'alpha-v1'
  | 'alpha-v2'
  | 'amp'
  | 'ampleforth'
  | 'ape-tax'
  | 'apeswap'
  | 'apy'
  | 'arcx'
  | 'armor'
  | 'autofarm'
  | 'b-protocol'
  | 'badger'
  | 'balancer-v1'
  | 'balancer-v2'
  | 'bancor'
  | 'bao'
  | 'barnbridge'
  | 'barnbridge-smart-yield'
  | 'basket-dao'
  | 'beefy'
  | 'beethoven-x'
  | 'belt'
  | 'benchmark'
  | 'benqi'
  | 'bent'
  | 'bitcoin'
  | 'blizz'
  | 'boring-dao'
  | 'botto'
  | 'bzx'
  | 'compound'
  | 'convex'
  | 'cream'
  | 'cryptex'
  | 'curve'
  | 'defi-kingdoms'
  | 'defi-swap'
  | 'defisaver'
  | 'derivadex'
  | 'deversifi'
  | 'dforce'
  | 'dfyn'
  | 'dhedge'
  | 'dinoswap'
  | 'dodo'
  | 'dopex'
  | 'dydx'
  | '88mph'
  | '88mph-v3'
  | 'element'
  | 'eleven-finance'
  | 'ellipsis'
  | 'epns'
  | 'essentia'
  | 'ethereum'
  | 'fei'
  | 'float-protocol'
  | 'frax'
  | 'gamma-strategies'
  | 'geist'
  | 'gmx'
  | 'governor-dao'
  | 'grim'
  | 'gro'
  | 'harvest'
  | 'hector-dao'
  | 'hegic'
  | 'honeyswap'
  | 'hop'
  | 'hundred-finance'
  | 'idle'
  | 'illuvium'
  | 'index-coop'
  | 'indexed'
  | 'inverse'
  | 'iron'
  | 'iron-bank'
  | 'jones-dao'
  | 'keep-network'
  | 'keeper-dao'
  | 'klima'
  | 'klondike'
  | 'kogefarm'
  | 'kyber-dao'
  | 'kyber-dmm'
  | 'launchpool'
  | 'liquiddriver'
  | 'liquity'
  | 'looksrare'
  | 'loopring'
  | 'lydia'
  | 'lyra'
  | 'maker'
  | 'maple'
  | 'mirror'
  | 'mooniswap'
  | 'morpheusswap'
  | 'mstable'
  | 'mushroom'
  | 'nexus-mutual'
  | 'nft'
  | 'nft20'
  | 'nftx'
  | 'nsure-network'
  | 'olympus'
  | 'ondo'
  | '1inch'
  | 'onx'
  | 'opium-network'
  | 'opyn'
  | 'origin'
  | 'orion-protocol'
  | 'otterclam'
  | 'pancakeswap'
  | 'pangolin'
  | 'penguin'
  | 'perpetual-protocol'
  | 'pickle'
  | 'pie-dao'
  | 'platypus-finance'
  | 'polywhale'
  | 'pooltogether'
  | 'pooltogether-v4'
  | 'popsicle'
  | 'powerpool'
  | 'qi-dao'
  | 'quickswap'
  | 'r-u-generous'
  | 'railgun'
  | 'rally'
  | 'rari'
  | 'rari-fuse'
  | 'realt'
  | 'reaper'
  | 'redacted-cartel'
  | 'reflexer'
  | 'ren'
  | 'ribbon'
  | 'ribbon-v2'
  | 'romedao'
  | 'sablier'
  | 'saddle'
  | 'scarecrow'
  | 'scream'
  | 'shapeshift'
  | 'shared-stake'
  | 'shell'
  | 'snowball'
  | 'snowbank'
  | 'snowdog'
  | 'snowswap'
  | 'spartacus'
  | 'spiritswap'
  | 'spookyswap'
  | 'squid'
  | 'stake-dao'
  | 'stormswap'
  | 'superfluid'
  | 'sushiswap'
  | 'sushiswap-bentobox'
  | 'sushiswap-kashi'
  | 'swapr'
  | 'swerve'
  | 'synlev'
  | 'synthetix'
  | 'tarot'
  | 'teddy-cash'
  | 'the-graph'
  | 'tokemak'
  | 'tokenlon'
  | 'tokens'
  | 'tokensets'
  | 'tomb'
  | 'tornado-cash'
  | 'traderjoe'
  | 'traderjoe-banker'
  | 'truefi'
  | 'ubeswap'
  | 'unagii'
  | 'uniswap'
  | 'uniswap-v2'
  | 'uniswap-v3'
  | 'unit'
  | 'universe'
  | 'vader'
  | 'venus'
  | 'vesper'
  | 'vesta-finance'
  | 'waultswap'
  | 'wepiggy'
  | 'wonderland'
  | 'xsigma'
  | 'xtoken'
  | 'yam'
  | 'yaxis'
  | 'yearn'
  | 'yieldyak'
  | 'zero-x'
  | 'zerotwohm'
  | 'zlot'

export type ZapperTokenInfoOfLpOfAccountAddressCell = {
  symbol: string
  assetType: 'liquidity-pool'
  tokenType: string
  balanceUSD: number
  balance: number
}

export type ZapperTokenInfoOfLpOfAccountAddress = [ZapperTokenInfoOfLpOfAccountAddressCell]

export type ZapperLpTokensInfoOfAccountAddress = {
  tokens: [ZapperTokenInfoOfLpOfAccountAddress, ZapperTokenInfoOfLpOfAccountAddress]
  blockchain: string
  protocolName: string
}

export type LpTokenInfo = {
  id: string
  symbol0: IArmadilloSupportedTokenName
  symbol1: IArmadilloSupportedTokenName
  balanceUSDTotal: number
  balanceUSD0: number
  balanceUSD1: number
  balanceUnits0: number
  balanceUnits1: number
  BlockchainName: string
  SupportedZapperProtocolNames: SupportedZapperProtocolNames
}

export type IlLpTokensInfoOfAccountAddress = {
  forAccountAddress: string
  lpTokensInfo: LpTokenInfo[]
}

export type ZapperToken = {
  type: string
  network: string
  symbol: string
  address: string
  decimals: number
  price: number | null
  hide: boolean
  balance: number
  balanceRaw: string
  balanceUSD: number
  tokens?: ZapperToken[]
  canExchange?: boolean
}

export type Asset = {
  type: string
  balanceUSD: number
  appId?: string
  tokens: ZapperToken[]
}

export type Product = {
  label: string
  meta: unknown[]
  assets: Asset[]
}

export type Meta = {
  label: string
  value: number
  type: string
}

export type Balances = {
  address: string
  balance: {
    products: Product[]
    meta: Meta[]
    error?: string
  }
}[]

export type Balance = {
  appId: string
  network: string
  balances: Balances
}

export type CoinData = {
  symbol: string
  protocolName: string
  assetType: 'liquidity-pool'
  tokenType: string
  balanceUSD: number
  balance: number
  blockchain: string
}

// Zapper V2

export type MetaType = 'wallet' | 'supplied' | 'borrowed' | 'claimable' | 'vesting'

export type DisplayItem = {
  type: string
  value: string | number
}

export type NonFungibleTokenBreakdown = {
  type: 'nft'
  appId: string | null
  metaType: MetaType
  address: string
  balanceUSD: number
  network: string
  breakdown: Array<PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown>
  context: {
    floorPrice: number
    holdersCount: number
  }
  displayProps: {
    label: string
    secondaryLabel: DisplayItem | null
    images: Array<string>
    stats: Array<{ label: DisplayItem; value: DisplayItem }>
    info: Array<{ label: DisplayItem; value: DisplayItem }>
    collectionImages: Array<string>
  }
}

export type TokenBreakdown = {
  type: 'token'
  appId: string | null
  metaType: MetaType
  address: string
  balanceUSD: number
  network: string
  breakdown: Array<PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown>
  context: {
    balance: number
    balanceRaw: string
    symbol: string
    price: number
    decimals: number
  }
  displayProps: {
    label: string
    secondaryLabel: DisplayItem | null
    images: string[]
    stats: Array<{ label: DisplayItem; value: DisplayItem }>
    info: Array<{ label: DisplayItem; value: DisplayItem }>
  }
}

export type PositionBreakdown = {
  type: 'position'
  appId: string | null
  metaType: MetaType
  address: string
  balanceUSD: number
  network: string
  breakdown: Array<PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown>
  displayProps: {
    label: string
    secondaryLabel: DisplayItem | null
    images: Array<string>
    stats: Array<{ label: DisplayItem; value: DisplayItem }>
    info: Array<{ label: DisplayItem; value: DisplayItem }>
  }
  context: {
    balance: number
    balanceRaw: string
    symbol: string
    price: number
    decimals: number
  }
}

export type ProtocolPayload = {
  appId: string
  network: string
  data: Array<PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  balances: Array<any>
  displayProps: {
    appName: string
    images: Array<string>
  }
  meta: {
    total: number
  }
}
