import axios from 'axios'
import { injectable, inject, postConstruct } from 'inversify'
import type { CVISupportedChainIds } from '../types'
import { CHAIN_IDS_INFO, NetworkName } from '../types'

@injectable()
export class GetForkNumberInversifyService {
  public stagingNodeForkBlockNumber?: number

  constructor(@inject('ChainId') public readonly chainId: CVISupportedChainIds) {}

  @postConstruct()
  public async init() {
    if ([NetworkName.Local, NetworkName.Staging].includes(CHAIN_IDS_INFO[this.chainId].networkName)) {
      const r = await axios.get<{
        description: string
        dateTimeNowUtc: string
        forkTimeUtc: string
        forkBlockNumber: number
        podRunningMinutes: number
        startServerTimeUtc: string
        hardhatPreparationTimeMinutes: number
      }>('https://hardhat-arbitrum-deployments-file.cvi-team.com')

      this.stagingNodeForkBlockNumber = r.data.forkBlockNumber
    }
  }
}
