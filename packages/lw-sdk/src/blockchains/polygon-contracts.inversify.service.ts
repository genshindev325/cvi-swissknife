import { inject, injectable } from 'inversify'
import { BigNumber } from 'ethers'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { getBlockFromTimestamp } from '../block-rate'
import type { ChainId } from '../types'
import { BlockchainName, CHAIN_IDS_INFO } from '../types'
import type { GetContractInversifyService } from '../get-contract.inversify.service'
import type { CVIUSDCPlatform } from '@coti-cvi/auto-generated-code/contracts'
@injectable()
export class PolygonContractsInversifyService {
  private readonly cviUsdcPlatformContract: CVIUSDCPlatform

  constructor(
    @inject('GetContractInversifyService') private readonly getContractInversifyService: GetContractInversifyService,
    @inject('ChainId') private readonly chainId: ChainId,
    @inject('EthersJsonRpcBatchProvider') private readonly ethersJsonRpcBatchProvider: JsonRpcProvider,
  ) {
    this.cviUsdcPlatformContract = this.getContractInversifyService.getContractFromDeploymentsFile(
      BlockchainName.POLYGON,
      'CVIUSDCPlatform',
    )
  }

  async calculatePositionBalance(account: string, blockTag?: number): Promise<BigNumber> {
    try {
      const res = await this.cviUsdcPlatformContract.calculatePositionBalance(account, { blockTag })

      return res.positionUnitsAmount
    } catch (error) {
      return BigNumber.from(0)
    }
  }

  public async getOpenPositionWorthOfWallets({
    walletIds,
    fromTsSeconds,
  }: {
    walletIds: string[]
    fromTsSeconds?: number
  }): Promise<BigNumber[]> {
    /**
     * raw response from contract to a single call:
     * {
     status: 'fulfilled'
     value: {
       '0': '140604014162'
       '1': true
       '2': '369887175744'
       '3': '1'
       '4': '822347483'
       '5': '0'
       currentPositionBalance: '140604014162'
       isPositive: true
       positionUnitsAmount: '369887175744'
       leverage: '1'
       fundingFees: '822347483'
       marginDebt: '0'
      }
    }
    */

    const latestBlock = await this.ethersJsonRpcBatchProvider.getBlock('latest')
    const blockTag =
      fromTsSeconds === undefined
        ? undefined
        : getBlockFromTimestamp(CHAIN_IDS_INFO[this.chainId].blockchainName, latestBlock, fromTsSeconds)

    return Promise.all(walletIds.map(async walletId => this.calculatePositionBalance(walletId, blockTag)))
  }
}
