/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable radar/no-duplicated-branches */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable func-names */
/* eslint-disable promise/catch-or-return */

import type { W3, Platform } from '@coti-cvi/cvi-sdk'
import type { LPValue } from '../models/lpValueHistory'
import { LPValueModel } from '../models/lpValueHistory'
import { SECONDS_IN_DAY } from '../utils/general'
import { loggerInfo } from '../utils/logger'

const interval = SECONDS_IN_DAY * 1000

export async function startLPValues(w3s: W3[]) {
  await LPValueModel.sync(/* { force: true } */)

  await Promise.all(
    w3s.map(async w3 => {
      await saveLPValue(w3)
    }),
  )

  async function saveLPValue(w3: W3) {
    const platforms: Platform[] = Object.values(w3.platforms)

    const lpTokensPL: LPValue[] = await Promise.all(
      platforms.map(async p => ({
        chain: p.w3.getChain(),
        token: p.lpToken.id,
        block: await p.w3.block.web3.eth.getBlockNumber(),
        timestamp: Math.floor(Date.now() / 1000),
        value: await p.lpToken.getPrice(p.token),
        usdValue: await p.lpToken.getUSDPrice(),
      })),
    )

    lpTokensPL.forEach(async (lpTokenPL: LPValue) => {
      try {
        loggerInfo(`Adding ${JSON.stringify(lpTokenPL)} to table`)
        const res = await LPValueModel.create(lpTokenPL)
        loggerInfo(`Added ${JSON.stringify(res)}`)
      } catch (error) {
        loggerInfo(`lpTokensPL error ${error}`)
      }
    })
  }

  try {
  } catch (error) {
    console.trace(`Getting lp value error due to ${error}`)
  } finally {
    setTimeout(() => startLPValues(w3s), interval)
  }
}

export async function getAllLPValues(chain?: string, token?: string) {
  const where = {}

  if (chain) {
    // @ts-ignore
    where.chain = chain
  }

  if (token) {
    const lpToken = token.endsWith('LP') ? token : `${token}LP`
    // @ts-ignore
    where.token = lpToken
  }

  const lpValues = await LPValueModel.findAll({ where, raw: true })
  return lpValues.map(lpv => {
    const { chain, token, block, timestamp, value, usdValue } = lpv as any
    return { chain, token, block, timestamp, value: value ?? undefined, usdValue: usdValue ?? undefined }
  })
}
