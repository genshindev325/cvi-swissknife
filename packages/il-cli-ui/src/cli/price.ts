import type { ETHPriceInversifyService } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, isNum, isDev } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'

export class Price {
  public readonly priceOracleMenu: { [key: string]: MenuItem } = {
    g: { description: 'get eth price', action: () => this.getPrice() },
    s: {
      description: 'set eth price',
      action: () => this.setPrice(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<ETHPriceInversifyService> {
    const chainId = this.inverifyContext.useILChainId()
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'ETHPriceInversifyService',
    )
  }

  public async getPrice(): Promise<void> {
    const service = await this.getService()
    const { roundId, timestamp, priceNumber } = await service.getPrice()
    this.wrappers.writeOutput(`roundId: ${roundId} price: $${priceNumber} timestamp: ${timestamp}`)
  }

  public async setPrice(): Promise<void> {
    const service = await this.getService()
    const answer = await this.wrappers.question(`(number) set ETH price`)
    if (isNum(answer)) {
      await service.setPrice(+answer)
    }
  }
}
