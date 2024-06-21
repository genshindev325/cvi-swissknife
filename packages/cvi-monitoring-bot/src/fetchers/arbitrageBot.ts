/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable eqeqeq */

import { Fetcher } from './fetcher'

const BOT_ADDRESS = '0x0BBFDa1F51807Ae2af86b76B7d224dc25BbA1F8d'

export class ArbitrageBotFetcher extends Fetcher {
  async fetch(): Promise<any> {
    const promises =
      this.chain == 'Polygon' ? [this.getArbitrageEvents('CVI-USDC-LONG', 'UNIV2USDCCVOL-USDC-LONG')] : []
    return Promise.all(promises)
  }

  async getArbitrageEvents(volTokenName: string, pairName: string) {
    const days = this.interval / 86400000 + 0.01
    const [events, swaps, requests, rebases] = await Promise.all([
      ethVolEvents(this.w3, days, volTokenName),
      swapEvents(this.w3, days, pairName),
      ethVolRequestsEvents(this.w3, days, volTokenName),
      rebaseEvents(this.w3, 3, volTokenName),
      this.w3.getToken(volTokenName).refresh(),
    ])
    return {
      id: volTokenName,
      events: [...events, ...swaps, ...requests].sort((a, b) => b.blockNumber - a.blockNumber),
      rebaseEvents: rebases,
      token: this.w3.getToken(volTokenName),
    }
  }
}

async function ethVolRequestsEvents(w3: any, days: number, tokenName: string) {
  const token = w3.getToken(tokenName)
  return await token.getRequests({ account: BOT_ADDRESS, days, historyId: 'EventHistory' })
}

async function ethVolEvents(w3: any, days: number, tokenName: string) {
  const { contract } = w3.getToken(tokenName)
  const filters = [{ account: BOT_ADDRESS }]
  const eventsData = [{ contract, events: { Burn: filters, Mint: filters, CollateralizedMint: filters } }]
  return await w3.getEvents(eventsData, { days })
}

async function swapEvents(w3: any, days: number, tokenName: string) {
  const { contract } = w3.getToken(tokenName)
  const eventsData = [{ contract, events: { Swap: [{ to: BOT_ADDRESS }] } }]
  return await w3.getEvents(eventsData, { days })
}

async function rebaseEvents(w3: any, days: number, tokenName: string) {
  const { contract } = w3.getToken(tokenName)
  const eventsData = [{ contract, events: { Rebase: [{}] } }]
  return await w3.getEvents(eventsData, { days })
}
