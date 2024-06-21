/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-const */
/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable radar/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable promise/catch-or-return */

import { Sequelize, Op } from 'sequelize'
import type { W3, Chain, Contracts } from '@coti-cvi/cvi-sdk'
import { fromBN } from '@coti-cvi/cvi-sdk'
import type { CVIHistory } from '../models/cviHistory'
import { CVIHistoryModel } from '../models/cviHistory'
import environment from '../utils/environment'
import { loggerInfo } from '../utils/logger'

const proxyABI = [
  {
    inputs: [],
    name: 'aggregator',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'description',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
    name: 'getRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'latestRoundData',
    outputs: [
      { internalType: 'uint80', name: 'roundId', type: 'uint80' },
      { internalType: 'int256', name: 'answer', type: 'int256' },
      { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
      { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
      { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]
const ethereumAddress = '0x1B58B67B2b2Df71b4b0fb6691271E83A0fa36aC5'
const polygonAddress = '0xB527769842f997d56dD1Ff73C34192141b69077e'
const arbitrumAddress = '0xbcD8bEA7831f392bb019ef3a672CC15866004536'
const ethereumAggregatorAddress = '0xB8169f6D97c66c50Ef27B7b1b3FB2875d2b036a4'
const polygonAggregatorAddress = '0x8143e3784FcabAE2964a25390Fa3aC8F219D8Eb7'
const arbitrumAggregatorAddress = '0xb58AFa4be9B13D896E81D5355C961D2c33172099'

const ethereumJson = {
  AGGREGATOR: { address: ethereumAggregatorAddress, abi: aggregatorV3InterfaceABI },
  PROXY: { address: ethereumAddress, abi: proxyABI },
}

const polygonJson = {
  AGGREGATOR: { address: polygonAggregatorAddress, abi: aggregatorV3InterfaceABI },
  PROXY: { address: polygonAddress, abi: proxyABI },
}

const arbitrumJson = {
  AGGREGATOR: { address: arbitrumAggregatorAddress, abi: aggregatorV3InterfaceABI },
  PROXY: { address: arbitrumAddress, abi: proxyABI },
}

const jsonData: { [chain in Chain]?: Contracts } = {
  Ethereum: ethereumJson,
  Polygon: polygonJson,
  Arbitrum: arbitrumJson,
}

export const cviCache: { [chain: string]: CVIHistory[] } = {}

export function cviDBData(chain: string) {
  return cviCache[chain].sort((a, b) => b.timestamp - a.timestamp)
}

export async function startCVISync(w3s: W3[]) {
  await CVIHistoryModel.sync(/* { force: true } */)

  const all = (await CVIHistoryModel.findAll()).map(h => h && h.get())
  w3s.map(w3 => {
    // @ts-ignore
    w3.addContracts(jsonData[w3.chain])
    initCache(w3, all)
    const delay = environment.delayInterval || w3.block.blockRate
    let lastPromise: Promise<void> | undefined = undefined
    setInterval(async () => {
      if (lastPromise) {
        return
      }
      lastPromise = syncPast(w3)
      await lastPromise
      lastPromise = undefined
    }, delay * 1000)
  })
}

async function syncPast(w3: W3) {
  const chain = w3.chain
  try {
    const proxy = w3.getContract('PROXY')
    const proxyAggregatorAddress: string = await w3.call(proxy, 'aggregator')
    const lastDBData = await getLatestFromDB(chain)
    let lastDBRound: number = (lastDBData && lastDBData.round) || 0
    let aggregator = w3.getContract('AGGREGATOR', lastDBData && lastDBData.address)

    const latestRound = await w3.call(aggregator, 'latestRoundData')
    let lastRound: number = latestRound.roundId
    if (lastDBRound == lastRound && proxyAggregatorAddress != aggregator.options.address) {
      // proxy aggregator changed
      const aggregatorAddress = await w3.call(proxy, 'aggregator')
      aggregator = w3.getContract('AGGREGATOR', aggregatorAddress)
      loggerInfo(`new aggregator ${aggregator.options.address}`)
      const latestRound = await w3.call(aggregator, 'latestRoundData')
      const firstRound = await w3.call(aggregator, 'getRoundData', [1])
      const version = await w3.call(aggregator, 'version')
      await deleteOverlapping(firstRound.updatedAt, version - 1, chain)
      lastRound = latestRound.roundId
      lastDBRound = 0
    }
    const aggregatorVersion = await w3.call(aggregator, 'version')
    const decimals: number = await w3.call(aggregator, 'decimals')

    const mapper = (r: { roundId: string; updatedAt: string; answer: string }): CVIHistory => {
      if (!r) {
        // @ts-ignore
        return null
      }
      return {
        round: +r.roundId,
        timestamp: +r.updatedAt,
        cvi: fromBN(r.answer, decimals),
        chain,
        chain_id: w3.chainId,
        address: aggregator.options.address,
        version: aggregatorVersion,
      }
    }

    const getRound = async (round: number): Promise<CVIHistory> => {
      return mapper(await w3.call(aggregator, 'getRoundData', [round]))
    }

    for (let round = lastDBRound + 1; round <= lastRound; round++) {
      try {
        await handleRound(round, aggregatorVersion, chain, getRound)
      } catch (error) {
        console.error(`error on round id ${round}: ${error}`)
        throw error
      }
    }
  } catch (error) {
    console.trace(`${chain} CVISync error ${error}`)
  }
}

async function handleRound(
  round: number,
  version: number,
  chain: string,
  getRound: (round: number) => Promise<CVIHistory>,
) {
  const item = await CVIHistoryModel.findOne({ where: { [Op.and]: [{ chain }, { version }, { round }] } })
  if (item === null) {
    const roundData = await getRound(round)
    if (roundData && roundData.timestamp > 0) {
      loggerInfo(`${chain} saving a new CVI history round: ${round}`)
      cviCache[chain].push(roundData)
      await CVIHistoryModel.create(roundData)
    }
  }
}

async function getLatestFromDB(chain: string): Promise<CVIHistory> {
  const versionRes = await CVIHistoryModel.findOne({
    attributes: [[Sequelize.fn('MAX', Sequelize.col('version')), 'version']],
    where: { chain },
  })
  const { version } = (versionRes && (versionRes.get() as { version: number })) || { version: 0 }
  const roundRes = await CVIHistoryModel.findOne({
    attributes: [[Sequelize.fn('MAX', Sequelize.col('round')), 'round']],
    where: { [Op.and]: [{ chain }, { version }] },
  })
  const { round } = (roundRes && (roundRes.get() as { round: number })) || { round: 0 }
  const res = await CVIHistoryModel.findOne({ where: { [Op.and]: [{ chain }, { version }, { round }] } })
  // @ts-ignore
  return (res && res.get()) || null
}

async function deleteOverlapping(timestamp: number, version: number, chain: string) {
  const overlaping = await CVIHistoryModel.findAll({
    where: { [Op.and]: [{ chain }, { version }, { timestamp: { [Op.gte]: timestamp } }] },
  })
  loggerInfo(`${chain} deleting ${overlaping.length} overlaping rounds from aggregator v${version} - ${timestamp}`)
  await Promise.all(overlaping.map(a => a.destroy({ force: true })))
}

function initCache(w3: W3, all: CVIHistory[]) {
  cviCache[w3.chain] = all.filter(h => h.chain === w3.chain)
}
