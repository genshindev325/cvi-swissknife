/* eslint-disable @typescript-eslint/no-explicit-any */

import type { JsonRpcProvider } from '@ethersproject/providers'
import { Container } from 'inversify'
import type {
  BlockchainName,
  ChainId,
  CVIOracleInversifyService,
  GetContractInversifyService,
  ILProtectionInversifyService,
  IlSupportedChainIds,
  Token,
  TokenName,
  Contracts,
  ILContractsEventsInversifyService,
  TvSupportedChainIds,
  ChainsInfo,
  AvailableProtectionsInversifyService,
  IERC20,
  ILAdminApiInversifyService,
  ThetaVaultInversifyService,
  StakingInversifyService,
  VtInversifyService,
  TvContractsEventsInversifyService,
  VtContractsEventsInversifyService,
  EmbedArmadilloDiscountInversifyService,
  HardhatImpersonateAccountInversifyService,
  PackageName,
} from '@coti-cvi/lw-sdk'
import { ErrorKind } from '@coti-cvi/lw-sdk'
import { inversifyBuilder } from '@coti-cvi/lw-sdk'
import { createCviModule } from '@coti-cvi/lw-sdk'
import { TV_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import { IL_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import {
  createContractsModule,
  CustomError,
  GlobalEventsInversifyService,
  LatestBlockInfoInversifyService,
  createCommonModule,
  createIlFrontendsModule,
} from '@coti-cvi/lw-sdk'
import type { ethers } from 'ethers'
import * as Sentry from '@sentry/react'
import type { IpGeoLocationInversifyService } from '@coti-cvi/lw-sdk/src/ip-geo-location.inversify.service'

export interface GetAsyncOverloads {
  (token: 'IpGeoLocationInversifyService'): Promise<IpGeoLocationInversifyService>
  (token: 'HardhatImpersonateAccountInversifyService'): Promise<HardhatImpersonateAccountInversifyService>
  (token: 'GlobalEventsInversifyService'): Promise<GlobalEventsInversifyService>
  (token: 'ChainId'): Promise<ChainId>
  (token: 'SingleDeploymentsFile'): Promise<Contracts>
  (token: 'EthersJsonRpcBatchProvider'): Promise<JsonRpcProvider>
  (token: 'GetContractInversifyService'): Promise<GetContractInversifyService>
  (token: 'LatestBlockInfoInversifyService'): Promise<LatestBlockInfoInversifyService>
}

export interface GetByBlockchainOverloads {
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ILContractsEventsInversifyService',
  ): Promise<ILContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'EmbedArmadilloDiscountInversifyService',
  ): Promise<EmbedArmadilloDiscountInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ILProtectionInversifyService',
  ): Promise<ILProtectionInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'AvailableProtectionsInversifyService',
  ): Promise<AvailableProtectionsInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds]['blockchainName'],
    token: 'ILAdminApiInversifyService',
  ): Promise<ILAdminApiInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'ThetaVaultInversifyService',
  ): Promise<ThetaVaultInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'TvContractsEventsInversifyService',
  ): Promise<TvContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'VtInversifyService',
  ): Promise<VtInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'VtContractsEventsInversifyService',
  ): Promise<VtContractsEventsInversifyService>
  (
    blockchainName: ChainsInfo[TvSupportedChainIds]['blockchainName'],
    token: 'StakingInversifyService',
  ): Promise<StakingInversifyService>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds | TvSupportedChainIds]['blockchainName'],
    token: 'TokenUSDC',
  ): Promise<Token<IERC20, TokenName.USDC>>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds | TvSupportedChainIds]['blockchainName'],
    token: 'TokenGOVI',
  ): Promise<Token<IERC20, TokenName.GOVI>>
  (
    blockchainName: ChainsInfo[IlSupportedChainIds | TvSupportedChainIds]['blockchainName'],
    token: 'CVIOracleInversifyService',
  ): Promise<CVIOracleInversifyService>
}

export type InitInversifyReturnType = {
  chainId: IlSupportedChainIds | TvSupportedChainIds
  getAsync: GetAsyncOverloads
  getByBlockchain: GetByBlockchainOverloads
  closeContainer: () => Promise<void>
  sentryExtras: Record<string, any>
}

export function cviUiInitInversify(
  chainId: IlSupportedChainIds | TvSupportedChainIds,
  singer?: ethers.Signer,
): InitInversifyReturnType {
  const container = new Container({ defaultScope: 'Singleton' })

  container.bind<PackageName>('PackageName').toConstantValue('beta-cvi-ui')

  container.bind('GlobalEventsInversifyService').to(GlobalEventsInversifyService)

  const globalEventsInversifyService = container.get<GlobalEventsInversifyService>('GlobalEventsInversifyService')

  const sentryExtras: Record<string, any> = {}

  globalEventsInversifyService.eventEmitter.on('errors', error => {
    const customError =
      error instanceof CustomError
        ? error
        : new CustomError({
            name: 'UnknownError',
            errorKind: ErrorKind.SystemError,
            message: 'unknown error',
            cause: error,
          })
    customError.extras = {
      ...customError.extras,
      ...sentryExtras,
    }
    Sentry.captureException(customError)
    CustomError.printErrorToConsole(customError)
  })

  container.bind<IlSupportedChainIds | TvSupportedChainIds>('ChainId').toConstantValue(chainId)

  container.load(createCommonModule({ chainId, ...(singer && { signer: singer }) }))
  container.load(createContractsModule({ chainId }))

  const ilChainId = IL_SUPPORTED_CHAIN_IDS.find(c => c === chainId)
  if (ilChainId) {
    container.load(createIlFrontendsModule({ chainId: ilChainId }))
  }

  if (TV_SUPPORTED_CHAIN_IDS.some(c => Number(c) === Number(chainId))) {
    container.load(createCviModule())
  }

  container.bind('LatestBlockInfoInversifyService').to(LatestBlockInfoInversifyService)

  return {
    sentryExtras,
    chainId,
    ...inversifyBuilder<BlockchainName>(container, globalEventsInversifyService),
  }
}
