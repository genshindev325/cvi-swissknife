/* eslint-disable @typescript-eslint/no-explicit-any */

import { Container } from 'inversify'
import {
  createCviModule,
  createVestingModule,
  inversifyBuilder,
  ChainId,
  GmxContractsEventsInversifyService,
  FormatGmxContractsEventsInversifyService,
  GmxContractsInversifyService,
} from '@coti-cvi/lw-sdk'
import { IL_SUPPORTED_CHAIN_IDS, TV_SUPPORTED_CHAIN_IDS, VESTING_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import type {
  ThetaVaultInversifyService,
  StakingInversifyService,
  VtInversifyService,
  CVIOracleInversifyService,
  GetContractInversifyService,
  IERC20,
  ILProtectionInversifyService,
  CVISupportedChainIds,
  Token,
  TokenName,
  SignerInversifyService,
  ProviderInversifyService,
  CviOldPlatformContractsEventsInversifyService,
  Contracts,
  UntypedToken,
  EmbedArmadilloDiscountInversifyService,
  EmbedHardhatImpersonationInversifyService,
  HardhatCommandsInversifyService,
  HardhatAdvanceTimeInversifyService,
  ChainsInfo,
  IlSupportedChainIds,
  TvSupportedChainIds,
  VestingSupportedChainIds,
  ILContractsEventsInversifyService,
  IlContractsInversifyService,
  BlockchainName,
  ILAdminApiInversifyService,
  ETHPriceInversifyService,
  VtContractsEventsInversifyService,
  TvContractsEventsInversifyService,
  VtReBaserInversifyService,
  RewardRouterInversifyService,
  VestingInversifyService,
  RewardRouterContractsEventsInversifyService,
  VestingContractsEventsInversifyService,
  UniswapInversifyService,
  GenericContractInteractionInversifyService,
  OverridesInversifyService,
} from '@coti-cvi/lw-sdk'
import {
  createContractsModule,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  GasPriceInversifyService,
  createIlFrontendsModule,
  createCommonModule,
} from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { Signer } from 'ethers'

export interface GetAsyncOverloads {
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'ChainId'): Promise<CVISupportedChainIds>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
  (token: 'Signer'): Promise<Signer>
  (token: 'SignerInversifyService'): Promise<SignerInversifyService>
  (token: 'ProviderInversifyService'): Promise<ProviderInversifyService>
  (token: 'GasPriceInversifyService'): Promise<GasPriceInversifyService>
  (token: 'OverridesInversifyService'): Promise<OverridesInversifyService>
  (token: 'HardhatCommandsInversifyService'): Promise<HardhatCommandsInversifyService>
  (token: 'HardhatAdvanceTimeInversifyService'): Promise<HardhatAdvanceTimeInversifyService>
  (token: 'UniswapInversifyService'): Promise<UniswapInversifyService>
  (token: 'GenericContractInteractionInversifyService'): Promise<GenericContractInteractionInversifyService>
}

export interface GetByBlockchainOverloads {
  (
    blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'],
    token: 'CVIOracleInversifyService',
  ): Promise<CVIOracleInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'EmbedArmadilloDiscountInversifyService',
  ): Promise<EmbedArmadilloDiscountInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'EmbedHardhatImpersonationInversifyService',
  ): Promise<EmbedHardhatImpersonationInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'IlContractsInversifyService',
  ): Promise<IlContractsInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ILAdminApiInversifyService',
  ): Promise<ILAdminApiInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ILContractsEventsInversifyService',
  ): Promise<ILContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ILProtectionInversifyService',
  ): Promise<ILProtectionInversifyService>
  (blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'], token: 'TokenUSDC'): Promise<
    Token<IERC20, TokenName.USDC>
  >
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'ILProtectionInversifyService',
  ): Promise<ILProtectionInversifyService>
  (blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'], token: 'TokenGOVI'): Promise<
    Token<IERC20, TokenName.GOVI>
  >
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'VtContractsEventsInversifyService',
  ): Promise<VtContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'ThetaVaultInversifyService',
  ): Promise<ThetaVaultInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'VtInversifyService',
  ): Promise<VtInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'VtReBaserInversifyService',
  ): Promise<VtReBaserInversifyService>
  (blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'], token: 'CVIUSDCThetaToken'): Promise<UntypedToken>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'TvContractsEventsInversifyService',
  ): Promise<TvContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'CVIUSDCVolatilityToken',
  ): Promise<UntypedToken>
  (blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'], token: 'CVIUSDCShortToken'): Promise<UntypedToken>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'StakingInversifyService',
  ): Promise<StakingInversifyService>
  (
    blockchainName: ChainsInfo[VestingSupportedChainIds]['blockchainName'],
    token: 'RewardRouterInversifyService',
  ): Promise<RewardRouterInversifyService>
  (
    blockchainName: ChainsInfo[VestingSupportedChainIds]['blockchainName'],
    token: 'VestingInversifyService',
  ): Promise<VestingInversifyService>
  (
    blockchainName: ChainsInfo[VestingSupportedChainIds]['blockchainName'],
    token: 'RewardRouterContractsEventsInversifyService',
  ): Promise<RewardRouterContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[VestingSupportedChainIds]['blockchainName'],
    token: 'VestingContractsEventsInversifyService',
  ): Promise<VestingContractsEventsInversifyService>
  (blockchainName: ChainsInfo[VestingSupportedChainIds]['blockchainName'], token: 'TokenEsGOVI'): Promise<UntypedToken>
  (
    blockchainName: ChainsInfo[CVISupportedChainIds]['blockchainName'],
    token: 'CviOldPlatformContractsEventsInversifyService',
  ): Promise<CviOldPlatformContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ETHPriceInversifyService',
  ): Promise<ETHPriceInversifyService>
  (
    blockchainName: ChainsInfo[
      | ChainId.ArbitrumMainnet
      | ChainId.ArbitrumStaging
      | ChainId.ArbitrumLocal]['blockchainName'],
    token: 'GmxContractsEventsInversifyService',
  ): Promise<GmxContractsEventsInversifyService>
}

export type InversifyContainer = {
  getAsync: GetAsyncOverloads
  getByBlockchain: GetByBlockchainOverloads
  closeContainer: () => void
}

export function initInversify(
  options: { chainId: ChainId } & (
    | {
        privateKey: string
      }
    | { impersonatedPublicWalletAddress: string }
    | { signer: Signer }
    | {}
  ),
): InversifyContainer {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind('ChainId').toConstantValue(options.chainId)

  container.load(createCommonModule(options))
  container.load(createContractsModule(options))

  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)
  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)
  container.bind('GasPriceInversifyService').to(GasPriceInversifyService)

  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')

  const ilChainId = IL_SUPPORTED_CHAIN_IDS.find(c => c === options.chainId)
  if (ilChainId) {
    container.load(createIlFrontendsModule({ chainId: ilChainId }))
  }

  if (TV_SUPPORTED_CHAIN_IDS.some(c => c === options.chainId)) {
    container.load(createCviModule())
  }

  if (VESTING_SUPPORTED_CHAIN_IDS.some(c => c === options.chainId)) {
    container.load(createVestingModule())
  }

  if ([ChainId.ArbitrumMainnet, ChainId.ArbitrumStaging, ChainId.ArbitrumLocal].includes(options.chainId)) {
    container.bind('GmxContractsEventsInversifyService').to(GmxContractsEventsInversifyService)
    container.bind('FormatGmxContractsEventsInversifyService').to(FormatGmxContractsEventsInversifyService)
    container.bind('GmxContractsInversifyService').to(GmxContractsInversifyService)
  }

  return inversifyBuilder<BlockchainName>(container, globalEventsInversifyService)
}
