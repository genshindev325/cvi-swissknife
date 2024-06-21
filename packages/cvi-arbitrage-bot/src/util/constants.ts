export const INTERVAL = process.env.INTERVAL ? +process.env.INTERVAL : 60000
export const MIN_PROFIT = process.env.MIN_PROFIT ? +process.env.MIN_PROFIT : 30
export const MIN_SWAP_PERCENT = process.env.MIN_SWAP_PERCENT ? +process.env.MIN_SWAP_PERCENT : 95
export const DRY_RUN = process.env.DRY_RUN ? process.env.DRY_RUN === 'true' : false
export const TOKENS = process.env.TOKENS ? process.env.TOKENS.split(',') : ['CVI-USDC-LONG', 'ETHVOL-USDC-LONG']
export const CHAINS = process.env.CHAINS ? process.env.CHAINS.split(',') : ['Ethereum', 'Polygon']
export const OPTIMAL_PERCENT = process.env.OPTIMAL_PERCENT ? +process.env.OPTIMAL_PERCENT : 100
export const MAX_TX_COST = process.env.MAX_TX_COST ? +process.env.MAX_TX_COST : 60
