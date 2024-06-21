/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable radar/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable promise/catch-or-return */

import type { BN, Chain, EventHistory, Staking, TransferEvent, W3 } from '@coti-cvi/cvi-sdk'
import { getW3 } from '@coti-cvi/cvi-sdk'
import { Sequelize, Op } from 'sequelize'
import environment from '../utils/environment'
import type { FeesHistory } from '../models/feesHistory'
import { FeesHistoryModel } from '../models/feesHistory'
import { asyncQueue } from '../async-queue'
import { loggerInfo } from '../utils/logger'

export let feesCache: { [chain: string]: { [token: string]: string } }
let dailyFeesCache: { [chain: string]: { [day: number]: { [token: string]: string } } }

export async function startStakingSync(w3s: W3[]) {
  await FeesHistoryModel.sync(/* { force: true } */)

  const all = (await FeesHistoryModel.findAll()).map(h => h.get())
  dailyFeesCache = all.reduce(dailyReducer, {})
  feesCache = all.reduce(totalReducer, {})

  const stakings = w3s.flatMap(w3 => w3.staking)
  await Promise.all(
    stakings.map(async s => {
      for await (const t of s.tokens) {
        await handleToken(s, t)
      }
    }),
  )
}

export async function getCollectedFees(chain: string, from: number, to: number) {
  // const fromDay = from ? Math.floor(from / 86400) : 0
  // const toDay = to ? Math.floor(to / 86400) : Number.MAX_SAFE_INTEGER

  const w3 = getW3(chain as Chain)
  const { collectedFees } = await w3.staking.getCollectedFees({ historyId: 'GraphHistory' })

  return Object.fromEntries(collectedFees.map(r => [r.tokenId, r.sum.toString()]))

  // const reducer = (acc: { [token: string]: string }, item: { [token: string]: string }) => {
  //   for (const token in item) {
  //     acc[token] = (BigInt(acc[token] || '0') + BigInt(item[token] || '0')).toString()
  //   }
  //   return acc
  // }

  // const x = Object.entries(dailyFeesCache[chain])
  //   .filter(o => +o[0] >= fromDay && +o[0] <= toDay)
  //   .map(o => o[1])
  //   .reduce(reducer, {})
}

async function handleToken(staking: Staking, token: Staking.SToken, options?: { lastBlock: number }) {
  const delay = environment.delayInterval || staking.w3.block.blockRate
  // @ts-ignore
  let lastBlock: number = options && options.lastBlock ? options.lastBlock : undefined
  try {
    const { w3 } = staking
    const history = w3.getHistory('EventHistory') as EventHistory
    const latestBlock: number = (await w3.block.getLatestBlock()).number
    const syncedBlock: number = lastBlock || (await getLastSavedBlock(staking, token))
    if (syncedBlock === latestBlock) {
      return
    }

    const mapper = (r: TransferEvent): FeesHistory => {
      if (!r) {
        // @ts-ignore
        return null
      }
      return {
        blockNumber: r.blockNumber,
        token: token.id,
        tokenAddress: token.address,
        account: r.from,
        amount: r.tokenAmount,
        timestamp: r.timestamp,
        chain: w3.getChain(),
        chain_id: w3.chainId,
        hash: r.id,
      }
    }

    const topBlock = Math.min(latestBlock, syncedBlock + 2_000)
    const synced = ((topBlock / latestBlock) * 100).toFixed(6)
    loggerInfo(`${token} syncing blocks ${syncedBlock} to ${topBlock} - synced ${synced}%`)
    const period = await w3.block.getTimePeriod({ block: syncedBlock }, { block: topBlock })
    const r: {
      sum: BN
      events: TransferEvent[]
    } = await asyncQueue.push(() => history.getCollectedFees(w3.staking, token, period))
    const { events } = r
    const mappedEvents: FeesHistory[] = events.map(e => mapper(e)).reverse()

    for await (const e of mappedEvents) {
      await saveItem(token, e)
    }
    lastBlock = topBlock
  } catch (error) {
    console.trace(`${token} handleToken error ${error}`)
  } finally {
    // call self after delay (refresh)
    setTimeout(() => handleToken(staking, token, { lastBlock }), delay * 1000)
  }
}

async function saveItem(token: Staking.SToken, event: FeesHistory) {
  const item = await FeesHistoryModel.findOne({
    where: { [Op.and]: [{ hash: event.hash }, { chain: token.w3.getChain() }] },
  })
  if (item === null && event.amount !== '0') {
    // loggerInfo(`${token} saving event [block: ${event.blockNumber}, token:${event.token}, amount:${event.amount}]`)
    totalReducer(feesCache, event)
    dailyReducer(dailyFeesCache, event)
    await FeesHistoryModel.create(event)
  }
}

async function getLastSavedBlock(staking: Staking, token: Staking.SToken) {
  const lastDBData = await FeesHistoryModel.findOne({
    attributes: [[Sequelize.fn('MAX', Sequelize.col('blockNumber')), 'blockNumber']],
    where: { [Op.and]: [{ token: token.id }, { chain: staking.w3.getChain() }] },
  })
  // @ts-ignore
  return +(lastDBData.get().blockNumber || staking.getTokenStart(token.id))
}

function totalReducer(acc: { [chain: string]: { [token: string]: string } }, item: FeesHistory) {
  const { chain } = item
  acc[chain] = acc[chain] || {}
  acc[chain][item.token] = acc[chain][item.token] || '0'
  acc[chain][item.token] = (BigInt(acc[chain][item.token]) + BigInt(item.amount)).toString()
  return acc
}

function dailyReducer(acc: { [chain: string]: { [day: number]: { [token: string]: string } } }, item: FeesHistory) {
  const { chain } = item
  const day = Math.floor(+item.timestamp / 86400)
  acc[chain] = acc[chain] || {}
  acc[chain][day] = acc[chain][day] || {}
  acc[chain][day][item.token] = acc[chain][day][item.token] || '0'
  acc[chain][day][item.token] = (BigInt(acc[chain][day][item.token]) + BigInt(item.amount)).toString()
  return acc
}
