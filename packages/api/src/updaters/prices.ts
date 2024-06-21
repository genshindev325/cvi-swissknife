/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable radar/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable promise/catch-or-return */

import type { W3, Token } from '@coti-cvi/cvi-sdk'
import { Op } from 'sequelize'
import { stripModel } from '../services/sequelize'
import type { PriceHistory } from '../models/priceHistory'
import { PriceHistoryModel } from '../models/priceHistory'
import { SECONDS_IN_DAY } from '../utils/general'
import { asyncQueue } from '../async-queue'
import { loggerInfo } from '../utils/logger'

const interval = SECONDS_IN_DAY * 1000
const TOKENS_TO_SAVE = ['GOVI']

export const pricesCache: { [token: string]: PriceHistory } = {}

export async function startPricesSync(w3s: W3[]) {
  await PriceHistoryModel.sync(/* { force: true } */)

  const eth = w3s.find(w3 => w3.chain === 'Ethereum')
  // @ts-ignore
  savePrices(eth)
  // @ts-ignore
  initCache(eth)
}

async function savePrices(w3: W3) {
  try {
    const block = await w3.block.getLatestBlock()
    await Promise.all(
      Object.values(w3.tokens)
        .filter(t => TOKENS_TO_SAVE.includes(t.id))
        .map(t => savePrice(t, block.number, +block.timestamp)),
    )
  } catch (error) {
    console.trace(`${w3.chain} Prices sync error ${error}`)
  } finally {
    setTimeout(() => savePrices(w3), interval)
  }
}

async function savePrice(token: Token, blockNumber: number, timestamp: number) {
  const price: number = await asyncQueue.push(() => token.getUSDPrice())
  const tokenAddress = token.address
  const { chain } = token.w3

  const item = await PriceHistoryModel.findOne({ where: { [Op.and]: [{ tokenAddress }, { blockNumber }] } })
  if (item === null) {
    const priceData: PriceHistory = { chain, blockNumber, timestamp, token: token.id, tokenAddress, price }
    loggerInfo(`${token} saving a new token price: ${price}`)
    pricesCache[token.id] = priceData
    await PriceHistoryModel.create(priceData)
  }
}

function initCache(w3: W3) {
  Object.values(w3.tokens)
    .filter(t => TOKENS_TO_SAVE.includes(t.id))
    .map(t => initTokenCache(t))
}

async function initTokenCache(token: Token) {
  const item = await PriceHistoryModel.findOne({
    where: { tokenAddress: token.address },
    order: [['timestamp', 'DESC']],
  })
  // @ts-ignore
  pricesCache[token.id] = item ? item.get() : undefined
}

export async function getPrices(token?: string, timestamp?: number) {
  if (!timestamp) {
    return token ? [pricesCache[token]] : Object.values(pricesCache)
  }

  const tokenQuery = token ? { token } : {}
  const where = { [Op.and]: [{ timestamp: { [Op.gte]: timestamp } }, tokenQuery] }

  const prices = await PriceHistoryModel.findAll({ where, order: [['timestamp', 'ASC']] })
  return prices.map(p => stripModel(p))
}

export async function getLatestPrice(token: string) {
  return pricesCache[token]
}
