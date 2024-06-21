import { ContainerModule } from 'inversify'
import {
  CviCacheEventsApiInversifyService,
  FormatStakingContractsEventsInversifyService,
  FormatTvContractsEventsInversifyService,
  FormatVtContractsEventsInversifyService,
  StakingContractsEventsInversifyService,
  TvContractsEventsInversifyService,
  VtContractsEventsInversifyService,
} from '../contracts-events'
import { CviContractsInversifyService } from '../cvi-contracts'
import type { GetContractInversifyService } from '../get-contract.inversify.service'
import { StakingInversifyService } from '../staking'
import { ThetaVaultInversifyService } from '../theta-vault'
import type { ConnectedPair, Token } from '../token'
import type { IERC20, TokenName } from '../types'
import type { UniswapInversifyService } from '../uniswap'
import { VtReBaserInversifyService, VtInversifyService } from '../volatility-token'
//
export function createCviModule() {
  return new ContainerModule(bind => {
    bind('StakingInversifyService').to(StakingInversifyService)
    bind('ThetaVaultInversifyService').to(ThetaVaultInversifyService)
    bind('FormatVtContractsEventsInversifyService').to(FormatVtContractsEventsInversifyService)
    bind('FormatTvContractsEventsInversifyService').to(FormatTvContractsEventsInversifyService)
    bind('CviCacheEventsApiInversifyService').to(CviCacheEventsApiInversifyService)
    bind('TvContractsEventsInversifyService').to(TvContractsEventsInversifyService)
    bind('CviContractsInversifyService').to(CviContractsInversifyService)
    bind('FormatStakingContractsEventsInversifyService').to(FormatStakingContractsEventsInversifyService)
    bind('StakingContractsEventsInversifyService').to(StakingContractsEventsInversifyService)
    bind('CVIUSDCThetaToken').toDynamicValue(async ({ container }) => {
      const getContractInversifyService = await container.getAsync<GetContractInversifyService>(
        'GetContractInversifyService',
      )
      return getContractInversifyService.getTokenFromContract('CVIUSDCThetaVault')
    })
    bind('VtInversifyService').to(VtInversifyService)
    bind('VtReBaserInversifyService').to(VtReBaserInversifyService)
    bind('VtContractsEventsInversifyService').to(VtContractsEventsInversifyService)
    bind('CVIUSDCVolatilityToken').toDynamicValue(async ({ container }) => {
      const getContractInversifyService = await container.getAsync<GetContractInversifyService>(
        'GetContractInversifyService',
      )
      return getContractInversifyService.getTokenFromContract('CVIUSDCVolatilityToken')
    })
    bind('CVIUSDCShortToken').toDynamicValue(async ({ container }) => {
      const getContractInversifyService = await container.getAsync<GetContractInversifyService>(
        'GetContractInversifyService',
      )
      return getContractInversifyService.getTokenFromContract('CVIUSDCPlatform')
    })
    bind('cviUsdcPairContractAndLpToken').toDynamicValue(async ({ container }): Promise<ConnectedPair> => {
      const tokenCvi = await container.getAsync<Token<IERC20, TokenName.USDC>>('CVIUSDCVolatilityToken')
      const tokenUSDC = await container.getAsync<Token<IERC20, TokenName.CVI>>('TokenUSDC')
      const uniswapInversifyService = await container.getAsync<UniswapInversifyService>('UniswapInversifyService')
      const pair = await uniswapInversifyService.getPair(tokenUSDC, tokenCvi)

      if (!pair.isConnected()) {
        throw new Error(`${createCviModule.name} - pair is not connected`)
      }

      return pair
    })
  })
}
