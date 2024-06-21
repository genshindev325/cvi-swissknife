import { inject, injectable, optional } from 'inversify'
import type { ETHUSDOracle } from '@coti-cvi/auto-generated-code/contracts'
import type { GetContractInversifyService } from './get-contract.inversify.service'
import type { SignerInversifyService } from './signer.inversify.service'
import type { ChainId } from './types'
import { CHAIN_IDS_INFO, IL_SUPPORTED_CHAIN_IDS } from './types'
import { fromNumber, toNumber } from './util'

@injectable()
export class ETHPriceInversifyService {
  public readonly oracle: ETHUSDOracle

  constructor(
    @inject('ChainId') readonly chainId: ChainId,
    @inject('GetContractInversifyService') public readonly getContractInversifyService: GetContractInversifyService,
    @inject('SignerInversifyService') @optional() public readonly signerService?: SignerInversifyService,
  ) {
    const supportedIlChainId = IL_SUPPORTED_CHAIN_IDS.find(c => c === chainId)
    if (!supportedIlChainId) {
      throw new Error(`ChainId ${chainId} is not supported for ${ETHPriceInversifyService.name}`)
    }
    this.oracle = this.getContractInversifyService.getContractFromDeploymentsFile(
      CHAIN_IDS_INFO[supportedIlChainId].blockchainName,
      'ETHUSDOracle',
    )
  }

  public async getPrice() {
    const [decimals, [roundId, answer, , answerTimestamp]] = await Promise.all([
      this.oracle.decimals(),
      this.oracle.latestRoundData(),
    ])
    return {
      price: answer,
      priceNumber: toNumber(answer, decimals),
      roundId: roundId,
      timestamp: answerTimestamp.toNumber(),
      decimals,
    }
  }

  public async setPrice(price: number) {
    if (!this.signerService) {
      throw new Error('signerService is not provided')
    }
    const decimals = await this.oracle.decimals()
    return this.oracle.connect(this.signerService.signer).setPrice(fromNumber(price, decimals))
  }
}
