import { inject, injectable } from 'inversify'
import { ChainId } from '../types'
import type { GmxPositionManager, GmxPositionRouter, GmxRouter, GmxVault } from '@coti-cvi/auto-generated-code'
import { getContractFromAddressAndAbi } from '../util'
import type { JsonRpcProvider } from '@ethersproject/providers'
import { GmxPositionManagerJson, GmxPositionRouterJson, GmxRouterJson, GmxVaultJson } from '../common-abis'

const SUPPORTED_CHAIN_IDS = [ChainId.ArbitrumMainnet] as const
type SupportedChainIds = typeof SUPPORTED_CHAIN_IDS[number]

const GMX_CONTRACT_ADDRESSES: Record<
  SupportedChainIds,
  { gmxPositionManager: string; gmxPositionRouter: string; gmxRouter: string; gmxVault: string }
> = {
  [ChainId.ArbitrumMainnet]: {
    gmxPositionManager: '0x87a4088Bd721F83b6c2E5102e2FA47022Cb1c831',
    gmxPositionRouter: '0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868',
    gmxRouter: '0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064',
    gmxVault: '0x489ee077994B6658eAfA855C308275EAd8097C4A',
  },
}

@injectable()
export class GmxContractsInversifyService {
  public readonly gmxPositionManager: GmxPositionManager

  public readonly gmxPositionRouter: GmxPositionRouter

  public readonly gmxRouter: GmxRouter

  public readonly gmxVault: GmxVault

  constructor(
    @inject('ChainId') chainId: ChainId,
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
  ) {
    const supportedChainId = SUPPORTED_CHAIN_IDS.find(c => c === chainId)
    if (!supportedChainId) {
      throw new Error(`${GmxContractsInversifyService.name} - unsupported chain id: ${chainId}`)
    }
    this.gmxPositionManager = getContractFromAddressAndAbi(
      GMX_CONTRACT_ADDRESSES[supportedChainId].gmxPositionManager,
      GmxPositionManagerJson,
      provider,
      'gmxPositionManager',
    )
    this.gmxPositionRouter = getContractFromAddressAndAbi(
      GMX_CONTRACT_ADDRESSES[supportedChainId].gmxPositionRouter,
      GmxPositionRouterJson,
      provider,
      'gmxPositionRouter',
    )
    this.gmxRouter = getContractFromAddressAndAbi(
      GMX_CONTRACT_ADDRESSES[supportedChainId].gmxRouter,
      GmxRouterJson,
      provider,
      'gmxRouter',
    )
    this.gmxVault = getContractFromAddressAndAbi(
      GMX_CONTRACT_ADDRESSES[supportedChainId].gmxVault,
      GmxVaultJson,
      provider,
      'gmxVault',
    )
  }
}
