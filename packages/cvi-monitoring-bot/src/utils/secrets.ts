/* eslint-disable radix */
import dotenv from 'dotenv'
import logger from './logger'

export const ENV = process.env.NODE_ENV
dotenv.config({ path: ENV ? `.env.${ENV}` : '.env' })

const DEFAULT_PLATFORMS = ['CVI-USDC-Platform', 'ETHVOL-USDC-Platform', 'CVI-ETH-Platform']

export const { RPC_URL } = process.env
export const { POLYGON_RPC_URL } = process.env
export const { BOT_TOKEN } = process.env
export const { CHAT_ID } = process.env
export const { UPDATES_CHAT_ID } = process.env
export const INTERVAL = process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 3600000 // (default: 1 hour in ms)
export const USERS_INTERVAL = process.env.USERS_INTERVAL ? parseInt(process.env.USERS_INTERVAL) : 86400000 // (default: 1 day in ms)
export const PERIOD_FINISH_THRESHOLD = process.env.PERIOD_FINISH_THRESHOLD
  ? parseInt(process.env.PERIOD_FINISH_THRESHOLD)
  : 7200 // (default: 2 Hours in sec);
export const ACTIVE_PLATFORMS = process.env.ACTIVE_PLATFORMS
  ? process.env.ACTIVE_PLATFORMS.split(',')
  : DEFAULT_PLATFORMS
export const TOKENS = process.env.TOKENS ? process.env.TOKENS.split(',') : ['CVI-USDC-LONG', 'ETHVOL-USDC-LONG']
export const CHAINS = process.env.CHAINS ? process.env.CHAINS.split(',') : ['Ethereum', 'Polygon', 'Arbitrum']

if (!RPC_URL) {
  logger.error('No chain endpoint. Set RPC_URL environment variable.')
  process.exit(1)
}
