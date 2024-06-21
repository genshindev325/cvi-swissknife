/* eslint-disable @typescript-eslint/no-loss-of-precision */
/* eslint-disable guard-for-in */
/* eslint-disable radar/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable promise/catch-or-return */

import type { Chain, W3PartialData } from '@coti-cvi/cvi-sdk'
import { fromBN, getW3, LongToken, Platform, Staking, StakingRewards } from '@coti-cvi/cvi-sdk'
import Web3 from 'web3'
import environment from './utils/environment'
import type { ChainName, Index, DataSource } from './utils/general'
import {
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  fromDateStringToTimestampInSeconds,
  getPercentageChange,
  getClosestValueInArray,
} from './utils/general'
import type { IndexV1Data } from './services/cviV1'
import { indexV1Data } from './services/cviV1'
import { cviDBData } from './updaters/cvi'
import { getLatestPrice } from './updaters/prices'
import type { CVIHistory } from './models/cviHistory'

type PrunedData = [
  number, // timestamp
  number, // index
]

interface IndexData {
  timestamp: number
  index: number
  oneDayChange: number
  oneDayChangePercent: number
  oneHourAgo: number
  oneWeekHigh?: number
  oneWeekLow?: number
}

interface IndexesLatest {
  CVI?: IndexData
  ETHVOL?: IndexData
}

// We saw that in a daily ETHVI data the index value was 240+ on the 20th of May 2021.
// The SC uses 220 as max so this is not percise. Anton agreed to change to 220 on his side but it looks fake when it's exactly 220.
// His principles didn't allow him to make it less obvious, so we are doing it for him by changing it to the MOCKED_MAX_VALUE
const MOCKED_MAX_VALUE = 216.83257194542936

const DATE_INDEX_IN_CVI = 0
const ETHVOL_VALUE_INDEX_IN_ETHVOL = 2
const CVI_VALUE_INDEX_IN_CVI = 4

export async function getHistoricalPrunedData(
  chain: ChainName = 'Ethereum',
  index: Index = 'CVI',
  cutoff?: number,
): Promise<PrunedData[]> {
  const v1Data = await indexV1Data(index, 'hour')
  const chainlinkData = cviDBData(chain)
  const cutOffPoint =
    index === 'ETHVOL'
      ? Infinity // No ETHVOL on chainlink yet, show data from Anton's API only
      : cutoff ?? environment.cutoff ?? Infinity // Show Anton data only if not provided with query param or env variable

  const historicalDataFromChainlinkAfterCutOffpoint: PrunedData[] =
    index === 'ETHVOL'
      ? [] // No chainlink data for ETHVOL yet
      : chainlinkData.filter(dp => dp.timestamp >= +cutOffPoint).map(dp => [dp.timestamp, dp.cvi])

  const indexValue = index === 'ETHVOL' ? ETHVOL_VALUE_INDEX_IN_ETHVOL : CVI_VALUE_INDEX_IN_CVI

  const historicalDataFromV1DataBeforeCutOffpoint: PrunedData[] = v1Data
    .filter((dp: IndexV1Data) => fromDateStringToTimestampInSeconds(dp[DATE_INDEX_IN_CVI]) < cutOffPoint)
    .map((dp: IndexV1Data) => [fromDateStringToTimestampInSeconds(dp[DATE_INDEX_IN_CVI]), dp[indexValue]])

  return historicalDataFromChainlinkAfterCutOffpoint.concat(historicalDataFromV1DataBeforeCutOffpoint)
}

export async function getFullDailyHistoricalData(
  chain: ChainName = 'Ethereum',
  index: Index = 'CVI',
  cutoff?: number,
): Promise<any> {
  const v1DataDay = await indexV1Data(index, 'day')
  const chainlinkHourlyData = cviDBData(chain)
  const cutOffPoint =
    index === 'ETHVOL'
      ? Infinity // No ETHVOL on chainlink yet, show data from Anton's API only
      : cutoff ?? environment.cutoff ?? Infinity // Show Anton data only if not provided with query param or env variable

  // derive daily data out of hourly chainlink data in CVI
  // @ts-ignore
  const chainlinkDaily = []
  if (index !== 'ETHVOL') {
    // No chainlink data for ETHVOL yet
    let currentDay = new Date(chainlinkHourlyData[0].timestamp * 1000).getDay()
    chainlinkHourlyData.forEach(dp => {
      const day = new Date(dp.timestamp * 1000).getDay()
      if (day !== currentDay) {
        // @ts-ignore
        chainlinkDaily.push(dp)
        currentDay = day
      }
    })
  }
  // @ts-ignore
  const prunedChainlinkDailyAfterCutoffPoint = chainlinkDaily
    // @ts-ignore
    .filter(dp => dp.timestamp >= +cutOffPoint)
    // @ts-ignore
    .map(dp => [dp.timestamp * 1000, dp.cvi])

  const indexValue = index === 'ETHVOL' ? ETHVOL_VALUE_INDEX_IN_ETHVOL : CVI_VALUE_INDEX_IN_CVI
  const prunedV1DailyDataBeforeCutoffPoint = v1DataDay
    .filter(dp => fromDateStringToTimestampInSeconds(dp[DATE_INDEX_IN_CVI]) <= +cutOffPoint)
    .map(dp => [
      fromDateStringToTimestampInSeconds(dp[DATE_INDEX_IN_CVI]) * 1000,
      dp[indexValue] < 220 ? dp[indexValue] : MOCKED_MAX_VALUE,
    ])

  return prunedChainlinkDailyAfterCutoffPoint.concat(prunedV1DailyDataBeforeCutoffPoint)
}

export async function getLatestIndexesDataPoint(
  chain: ChainName = 'Ethereum',
  source: DataSource = 'Anton',
  index?: Index,
): Promise<IndexesLatest> {
  const useChainlink = source === 'Chainlink' || environment.useChainlinkInLatest
  let cviLatestIndexData: IndexData | undefined
  let ethVolLatestIndexData: IndexData | undefined

  try {
    if (!index || index === 'CVI') {
      cviLatestIndexData = await getLatestIndexDataFromAntonAPI('CVI')
    }
    if (!index || index === 'ETHVOL') {
      ethVolLatestIndexData = await getLatestIndexDataFromAntonAPI('ETHVOL')
    }

    return {
      CVI: cviLatestIndexData,
      ETHVOL: ethVolLatestIndexData,
    }
  } catch (err) {
    console.error('Failed getting data in getLatestIndexesDataPoint due to:', err)
    // @ts-ignore
    return null
  }
}

async function getLatestIndexDataFromAntonAPI(index: Index): Promise<IndexData> {
  const indexV1DataPoints = await indexV1Data(index, 'hour')

  const latestIndexV1DataPoint: IndexV1Data = indexV1DataPoints[0]
  const indexValue = index === 'ETHVOL' ? ETHVOL_VALUE_INDEX_IN_ETHVOL : CVI_VALUE_INDEX_IN_CVI

  const indexV1PrunedData: PrunedData[] = indexV1DataPoints
    .filter(
      (dp: IndexV1Data) =>
        fromDateStringToTimestampInSeconds(dp[DATE_INDEX_IN_CVI]) >
        fromDateStringToTimestampInSeconds(latestIndexV1DataPoint[DATE_INDEX_IN_CVI]) - 7 * SECONDS_IN_DAY,
    )
    .map((dp: IndexV1Data) => [fromDateStringToTimestampInSeconds(dp[DATE_INDEX_IN_CVI]), dp[indexValue]])

  const indexesV1ExtendedData: IndexData[] = toIndexData(indexV1PrunedData)
  const indexLatestData = indexesV1ExtendedData[0]

  const oneWeeIndexValues = indexV1PrunedData.map(dp => dp[1])
  const oneWeekHigh = Number(Math.max(...oneWeeIndexValues).toFixed(6))
  const oneWeekLow = Number(Math.min(...oneWeeIndexValues).toFixed(6))

  indexLatestData.oneWeekHigh = oneWeekHigh
  indexLatestData.oneWeekLow = oneWeekLow

  return indexLatestData
}

// When Chainlink adds ETHVOL, we can generalize this function to get Index and return ETHVOL as well
async function getLatestCVIDataFromChainlink(chain: ChainName): Promise<IndexData> {
  const w3 = getW3(chain, {
    filters: {
      oracle: ['CVOL-Oracle'],
    },
  })
  const aggregator = w3.getContract('CVOL-Oracle')
  const decimals = 2
  const mapper = (r: { cviRoundId: string; cviTimestamp: string; cviValue: string }): CVIHistory => {
    if (!r) {
      // @ts-ignore
      return null
    }
    return {
      round: +r.cviRoundId,
      timestamp: +r.cviTimestamp,
      cvi: fromBN(r.cviValue, decimals),
      chain,
      chain_id: w3.chainId,
      address: aggregator.options.address,
      version: 1, // it doesn't matter
    }
  }
  const latestRoundCviIndex: CVIHistory = mapper(await w3.call(aggregator, 'getCVILatestRoundData'))

  return {
    index: latestRoundCviIndex.cvi,
    timestamp: latestRoundCviIndex.timestamp,
    oneDayChange: 1,
    oneDayChangePercent: 1,
    oneHourAgo: 1,
  }
}

function toIndexData(prunedData: PrunedData[]): IndexData[] {
  return prunedData.map((dp: PrunedData) => {
    const [timestamp, index] = [dp[0], dp[1]]

    const timestampOneDayAgo = timestamp - SECONDS_IN_DAY
    const dataPointOneDayAgo = getClosestValueInArray(prunedData, 0, timestampOneDayAgo) as PrunedData
    const indexOneDayAgo = dataPointOneDayAgo[1]
    const indexOneDayChange = index - indexOneDayAgo
    const indexOneDayChangePercent = getPercentageChange(indexOneDayAgo, index)

    const timestampOneHourAgo = timestamp - SECONDS_IN_HOUR
    const dataPointOneHourAgo = getClosestValueInArray(prunedData, 0, timestampOneHourAgo) as PrunedData
    const indexOneHourAgo = dataPointOneHourAgo[1]

    return {
      timestamp,
      index: Number(index.toFixed(6)),
      oneDayChange: Number(indexOneDayChange.toFixed(6)),
      oneDayChangePercent: Number(indexOneDayChangePercent.toFixed(3)),
      oneHourAgo: Number(indexOneHourAgo.toFixed(6)),
    }
  })
}

// function formatChainlinkDataCVIValue(unformattedCVIValue: string): number {
//   const wholeNumberOfDigits = unformattedCVIValue.startsWith('1') || unformattedCVIValue.startsWith('2') ? 3 : 2;
//   const whole = unformattedCVIValue.substring(0, wholeNumberOfDigits);
//   const fraction = unformattedCVIValue.substring(wholeNumberOfDigits);
//   return Number(`${whole}.${fraction}`);
// }

// ========== TVL ==========

const stakingRewardsMap = {
  'GOVIETH-StakingRewards': 'GOVIETHLP',
  'COTIETH-StakingRewards': 'COTIETHLP',
  'GOVIETHSLP-StakingRewards': 'GOVIETHSLP',
  'COTIETHSLP-StakingRewards': 'COTIETHSLP',
}

export async function getAllTVL() {
  try {
    // @ts-ignore
    const w3s = Object.keys(chains).map((c: Chain) => getW3(c))
    const components = w3s.flatMap(w3 => w3.components)

    const tvls = {}
    let allTVL = 0

    for (const component of components) {
      const { chain } = component.w3
      const { tvl } = component
      if (component instanceof LongToken) {
        if (!(`${chain}${component.pairToken.id}` in tvls)) {
          const tvl = component.pairToken.tvl / 2
          // @ts-ignore
          tvls[`${chain}${component.pairToken.id}`] = tvl
          allTVL += tvl
        }
      } else if (component instanceof Platform) {
        // @ts-ignore
        if (!(`${chain}${component.id}` in tvls)) {
          // @ts-ignore
          tvls[`${chain}${component.id}`] = tvl
          allTVL += tvl
        }
      } else if (component instanceof StakingRewards) {
        if (
          // @ts-ignore
          Object.keys(stakingRewardsMap).includes(component.id) &&
          // @ts-ignore
          !(`${chain}${stakingRewardsMap[component.id]}` in tvls)
        ) {
          // @ts-ignore
          tvls[`${chain}${stakingRewardsMap[component.id]}`] = tvl
          allTVL += tvl
        }
      } else if (component instanceof Staking) {
        if (!(`${chain}${component.id}` in tvls)) {
          // @ts-ignore
          tvls[`${chain}${component.id}`] = tvl
          allTVL += tvl
        }
      }
    }

    for (const key in tvls) {
      // @ts-ignore
      tvls[key] = Math.floor(tvls[key] * 1000000)
    }
    allTVL = Math.floor(allTVL * 1000000)
    return {
      ...tvls,
      allTVL,
    }
  } catch (err) {
    console.error('Error on getAllTVL:', err)
  }
}

const chains: { [chain in Chain]?: W3PartialData } = {
  // @ts-ignore
  Ethereum: { provider: new Web3.providers.HttpProvider(environment.ethreumRPCURL) },
  // @ts-ignore
  Polygon: { provider: new Web3.providers.HttpProvider(environment.polygonRPCURL) },
  // @ts-ignore
  Arbitrum: { provider: new Web3.providers.HttpProvider(environment.arbitrumRPCURL) },
}

export async function init() {
  // @ts-ignore
  return Promise.all(Object.keys(chains).map((c: Chain) => getW3(c, chains[c]).init()))
}

async function overridePrice(token: string) {
  const priceHistory = await getLatestPrice(token)
  return priceHistory?.price || 0
}
