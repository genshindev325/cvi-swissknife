import type { JsonRpcProvider } from '@ethersproject/providers'
import { addPercentToBN, fromNumber, getChainId } from './util'
import type { Gas } from './types'
import { ChainId, CHAIN_IDS_INFO, NetworkName } from './types'

export class GasHelper {
  private gasPriceIncreasePercentage: number

  constructor(
    private readonly chain: string | ChainId,
    private readonly provider: JsonRpcProvider,
    options?: {
      gasPriceIncreasePercentage?: number
    },
  ) {
    this.gasPriceIncreasePercentage = options?.gasPriceIncreasePercentage ?? 10
  }

  public setGasPriceIncreasePercentage(newPercentage: number) {
    this.gasPriceIncreasePercentage = newPercentage
  }

  public getGas = async (txType = 2): Promise<Gas> => {
    const chainId = getChainId(this.chain)
    if (chainId && CHAIN_IDS_INFO[chainId].networkName === NetworkName.Mainnet) {
      // override txType in specific networks to legacy tx type
      txType = [ChainId.PolygonMainnet, ChainId.ArbitrumMainnet].includes(chainId) ? 0 : txType
      if (txType === 2) {
        const feeData = await this.provider.getFeeData()
        if (feeData.maxFeePerGas === null || feeData.maxPriorityFeePerGas === null) {
          return { maxFeePerGas: fromNumber(32, 9), maxPriorityFeePerGas: fromNumber(32, 9) }
        }
        return {
          maxFeePerGas: addPercentToBN(feeData.maxFeePerGas, this.gasPriceIncreasePercentage),
          maxPriorityFeePerGas: addPercentToBN(feeData.maxPriorityFeePerGas, this.gasPriceIncreasePercentage),
        }
      }
      return { gasPrice: addPercentToBN(await this.provider.getGasPrice(), this.gasPriceIncreasePercentage) }
    } else {
      return {}
    }
  }
}
