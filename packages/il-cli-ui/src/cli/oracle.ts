import type { CVIOracleInversifyService } from '@coti-cvi/lw-sdk'
import { CHAIN_IDS_INFO, isNum, isDev } from '@coti-cvi/lw-sdk'
import type { InverifyContext } from '../context/inversify-context'
import type { MenuItem } from '../types'
import type { Wrappers } from './wrappers'

export class Oracle {
  public readonly cviOracleMenu: { [key: string]: MenuItem } = {
    g: { description: 'get cvi index', action: () => this.getIndex() },
    s: {
      description: 'set cvi index',
      action: () => this.setIndex(),
      condition: () => isDev(this.inverifyContext.chainId),
    },
  }

  constructor(private readonly inverifyContext: Required<InverifyContext>, private readonly wrappers: Wrappers) {}

  private async getService(): Promise<CVIOracleInversifyService> {
    const chainId = this.inverifyContext.useCVIChainId()
    return this.inverifyContext.inversifyContainer.getByBlockchain(
      CHAIN_IDS_INFO[chainId].blockchainName,
      'CVIOracleInversifyService',
    )
  }

  public async getIndex(): Promise<void> {
    const service = await this.getService()
    const { cviRoundId, cviNumber, cviRoundTimestamp: cviTimestamp } = await service.getCviIndex()
    this.wrappers.writeOutput(`cviRoundId: ${cviRoundId} cvi: ${cviNumber} cviTimestamp: ${cviTimestamp}`)
  }

  public async setIndex(): Promise<void> {
    const service = await this.getService()
    const { cviNumber } = await service.getCviIndex()
    const answer = await this.wrappers.question(`(number) set cvi index (current: ${cviNumber.toFixed(4)})`)
    if (isNum(answer)) {
      await service.setHardhatCVIIndex(+answer)
    }
  }
}
