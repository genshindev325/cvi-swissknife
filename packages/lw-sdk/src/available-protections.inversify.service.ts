import { inject, injectable } from 'inversify'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'
import type { IlSupportedChainIds, ChainId } from './types'
import { BlockchainName, IL_SUPPORTED_CHAIN_IDS } from './types'
import type { GetContractInversifyService } from './get-contract.inversify.service'
import { getIlBackendClient } from './get-auto-generated-backend-clients'
import type { TokenPairRepository } from '@coti-cvi/auto-generated-code/contracts'

@injectable()
export class AvailableProtectionsInversifyService {
  public readonly tokenPairRepository: TokenPairRepository

  private readonly chainId: IlSupportedChainIds

  constructor(
    @inject('ChainId') chainId: ChainId,
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('GetContractInversifyService') public readonly getContractInversifyService: GetContractInversifyService,
  ) {
    this.tokenPairRepository = this.getContractInversifyService.getContractFromDeploymentsFile(
      BlockchainName.POLYGON,
      'TokenPairRepository',
    )

    const c = IL_SUPPORTED_CHAIN_IDS.find(c => c === chainId)
    if (c) {
      this.chainId = c
    } else {
      throw new Error(`ChainId: ${chainId} is not supported for IL`)
    }
  }

  public listenToLiquiditiesFromZapper(address: string) {
    const get = async () =>
      this.globalEventsInversifyService.emit('ilLiquiditiesFromZapper', async () => {
        const [responseForWallet] = await getIlBackendClient(this.chainId).zapperApi.zapperApiControllerAccountsLps({
          accountAddresses: [address],
        })
        return responseForWallet
      })

    get()

    const id = setInterval(get, 1000 * 60 * 5)

    return () => clearInterval(id)
  }

  public listenToPairsWorstIl() {
    const get = async () =>
      this.globalEventsInversifyService.emit('ilPairsWorstIl', async () => {
        return getIlBackendClient(this.chainId).maxIl.calcMaxIlControllerGetWorstIlPerPair()
      })

    get()

    const id = setInterval(get, 1000 * 60 * 5)

    return () => clearInterval(id)
  }
}
