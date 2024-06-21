import { Global, Module } from '@nestjs/common'
import { ConfigModule, SendInversifyErrorsToSentry } from '@coti-cvi/common-be'
import { InversifyService } from './inversify.service'
import type {
  ChainLinkKeepersRegistryInversifyService,
  CVIOracleInversifyService,
  GlobalEventsInversifyService,
  IERC20,
  LatestBlockInfoInversifyService,
  SignerInversifyService,
  ThetaVaultInversifyService,
  Token,
  TokenName,
  TvContractsEventsInversifyService,
  UniswapInversifyService,
  VtContractsEventsInversifyService,
  VtInversifyService,
  VtReBaserInversifyService,
} from '@coti-cvi/lw-sdk'
import type { JsonRpcProvider } from '@ethersproject/providers'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    InversifyService,
    {
      provide: 'InversifyContainerNestJsToken',
      useFactory: (inversifyService: InversifyService) => inversifyService.inverseContainer,
      inject: [InversifyService],
    },
  ],
  exports: [InversifyService, 'InversifyContainerNestJsToken'],
})
export class InitInversifyModule {}

@Module({
  imports: [InitInversifyModule, SendInversifyErrorsToSentry],
  providers: [
    {
      provide: 'GlobalEventsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<GlobalEventsInversifyService> =>
        inversifyService.inverseContainer.getAsync('GlobalEventsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'LatestBlockInfoInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<LatestBlockInfoInversifyService> =>
        inversifyService.inverseContainer.getAsync('LatestBlockInfoInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'EthersJsonRpcBatchProvider',
      useFactory: (inversifyService: InversifyService): Promise<JsonRpcProvider> =>
        inversifyService.inverseContainer.getAsync('EthersJsonRpcBatchProvider'),
      inject: [InversifyService],
    },
    {
      provide: 'SignerInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<SignerInversifyService> =>
        inversifyService.inverseContainer.getAsync('SignerInversifyService'),
      inject: [InversifyService],
    },

    {
      provide: 'ThetaVaultInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<ThetaVaultInversifyService> =>
        inversifyService.inverseContainer.getAsync('ThetaVaultInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'VtInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<VtInversifyService> =>
        inversifyService.inverseContainer.getAsync('VtInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'VtReBaserInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<VtReBaserInversifyService> =>
        inversifyService.inverseContainer.getAsync('VtReBaserInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'VtContractsEventsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<VtContractsEventsInversifyService> =>
        inversifyService.inverseContainer.getAsync('VtContractsEventsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'TvContractsEventsInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<TvContractsEventsInversifyService> =>
        inversifyService.inverseContainer.getAsync('TvContractsEventsInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'UniswapInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<UniswapInversifyService> =>
        inversifyService.inverseContainer.getAsync('UniswapInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'CVIOracleInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<CVIOracleInversifyService> =>
        inversifyService.inverseContainer.getAsync('CVIOracleInversifyService'),
      inject: [InversifyService],
    },
    {
      provide: 'TokenUSDC',
      useFactory: (inversifyService: InversifyService): Promise<Token<IERC20, TokenName.USDC>> =>
        inversifyService.inverseContainer.getAsync('TokenUSDC'),
      inject: [InversifyService],
    },
    {
      provide: 'ChainLinkKeepersRegistryInversifyService',
      useFactory: (inversifyService: InversifyService): Promise<ChainLinkKeepersRegistryInversifyService> =>
        inversifyService.inverseContainer.getAsync('ChainLinkKeepersRegistryInversifyService'),
      inject: [InversifyService],
    },
  ],
  exports: [
    'LatestBlockInfoInversifyService',
    'EthersJsonRpcBatchProvider',
    'GlobalEventsInversifyService',
    'SignerInversifyService',
    'ThetaVaultInversifyService',
    'VtInversifyService',
    'VtReBaserInversifyService',
    'VtContractsEventsInversifyService',
    'TvContractsEventsInversifyService',
    'UniswapInversifyService',
    'CVIOracleInversifyService',
    'TokenUSDC',
    'ChainLinkKeepersRegistryInversifyService',
  ],
})
export class InversifyModule {}
