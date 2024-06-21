import type { GmxContractsEventsInversifyService } from '@coti-cvi/lw-sdk'
import { BlockchainName } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'

export class GMX {
  public readonly gmxMenu: { [key: string]: MenuItem } = {
    p: { description: 'P&L', action: () => this.pnl() },
    h: { description: 'sync history test', action: () => this.history() },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<GmxContractsEventsInversifyService> {
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      BlockchainName.ARBITRUM,
      'GmxContractsEventsInversifyService',
    )
  }

  public async history(): Promise<void> {
    const service = await this.getService()
    await service.syncEvents({
      save: async (lastBlock: number, items: unknown[]) => console.log(`saving ${items.length} - ${lastBlock}`),
      load: async () => Promise.resolve({ lastBlock: 0 }),
      getEvents: async (from: number, to: number) => {
        const { closeEvents, increaseEvents, decreaseEvents } = await service.getPositionEvents({ from, to })
        return [closeEvents, increaseEvents, decreaseEvents].flat().sort((a, b) => b.blockNumber - a.blockNumber)
      },
    })
  }

  public async pnl(): Promise<void> {
    const service = await this.getService()
    const { increaseEvents, decreaseEvents, closeEvents } = await service.getPositionEvents({
      from: 46576446,
    })

    this.wrappers.writeOutput(`increaseEvents: ${increaseEvents.length}`)
    this.wrappers.writeOutput(`decreaseEvents: ${decreaseEvents.length}`)
    this.wrappers.writeOutput(`closeEvents: ${closeEvents.length}`)
    this.wrappers.writeOutput(
      `increaseEvents blocks: ${increaseEvents.map(e => `${e.blockNumber}-${e.transactionHash}`).join()}`,
    )
    this.wrappers.writeOutput(
      `decreaseEvents blocks: ${decreaseEvents.map(e => `${e.blockNumber}-${e.transactionHash}`).join()}`,
    )
    this.wrappers.writeOutput(
      `closeEvents blocks: ${closeEvents.map(e => `${e.blockNumber}-${e.transactionHash}`).join()}`,
    )
  }
}
