import { inject, injectable } from 'inversify'
import type { ChainId } from './types'
import { TV_SUPPORTED_CHAIN_IDS } from './types'
import type { ChainLinkKeepersRegistry } from '@coti-cvi/auto-generated-code'
import { getContractFromAddressAndAbi } from './util'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { ChainLinkKeepersRegistryJson } from './common-abis'

@injectable()
export class ChainLinkKeepersRegistryInversifyService {
  public readonly chainLinkKeepersRegistry: ChainLinkKeepersRegistry

  constructor(
    @inject('ChainId') chainId: ChainId,
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
  ) {
    const supportedChainId = TV_SUPPORTED_CHAIN_IDS.find(c => c === chainId)
    if (!supportedChainId) {
      throw new Error(`${ChainLinkKeepersRegistryInversifyService.name} - unsupported chain id: ${chainId}`)
    }
    const chainLinkKeepersRegistryAddress = '0x75c0530885F385721fddA23C539AF3701d6183D4'
    this.chainLinkKeepersRegistry = getContractFromAddressAndAbi(
      chainLinkKeepersRegistryAddress,
      ChainLinkKeepersRegistryJson,
      provider,
      'chainLinkKeepersRegistry',
    )
  }
}
