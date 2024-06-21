import { inject, injectable, preDestroy } from 'inversify'
import type { CviAdminApiStakingInversifyService } from './cvi-admin-api-staking.inversify.service'
import type { CviAdminApiThetaVaultsInversifyService } from './cvi-admin-api-theta-vaults.inversify.service'
import type { CviAdminApiVolatilityTokensInversifyService } from './cvi-admin-api-volatility-tokens.inversify.service'
import { sortEventsAsc } from '../../util'
import type { TradingCompetitionInfoParameters, TradingCompetitionInfoAddress } from './types'
import { AddressGroup } from './types'
import type { CviContractsInversifyService } from '../../cvi-contracts'
import { getAddressGroupAndName } from '../../util/internal-accounts'
import type { AllVtEvents } from '../../volatility-token'
import { VtStatisticsApi } from '../../volatility-token'
import { CviBackendClientApi } from '@coti-cvi/auto-generated-code'
import type { LatestGeneralInfoOfEventByAddressInversifyService } from './latest-general-info-of-event-by-address.inversify.service'
import type { CacheInversifyService } from '../../cache.inversify.service'
import type { UpdateGeneralInfoOfEventAndAddressesDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'

@injectable()
export class CviAdminApiInversifyService {
  private cleanups: (() => void)[] = []

  private lastPromise?: Promise<void>

  constructor(
    @inject('IsTestMode')
    public readonly isTestMode: boolean,
    @inject('CacheInversifyService') public readonly cacheInversifyService: CacheInversifyService,
    @inject('LatestGeneralInfoOfEventByAddressInversifyService')
    public readonly latestGeneralInfoOfEventByAddressInversifyService: LatestGeneralInfoOfEventByAddressInversifyService,
    @inject('CviAdminApiStakingInversifyService')
    public readonly cviAdminApiStakingInversifyService: CviAdminApiStakingInversifyService,
    @inject('CviAdminApiVolatilityTokensInversifyService')
    public readonly cviAdminApiVolatilityTokensInversifyService: CviAdminApiVolatilityTokensInversifyService,
    @inject('CviAdminApiThetaVaultsInversifyService')
    public readonly cviAdminApiThetaVaultsInversifyService: CviAdminApiThetaVaultsInversifyService,
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
  ) {}

  public isReady() {
    return (
      this.isTestMode ||
      Boolean(
        this.latestGeneralInfoOfEventByAddressInversifyService.isReady() &&
          this.cviAdminApiVolatilityTokensInversifyService.isReady() &&
          this.cviAdminApiThetaVaultsInversifyService.isReady(),
      )
    )
  }

  public isReadyDescription() {
    return {
      isTestMode: this.isTestMode,
      latestGeneralInfoOfEventByAddressInversifyService:
        this.latestGeneralInfoOfEventByAddressInversifyService.isReadyDescription(),
      cviAdminApiVolatilityTokensInversifyService:
        this.cviAdminApiVolatilityTokensInversifyService.isReadyDescription(),
      cviAdminApiThetaVaultsInversifyService: this.cviAdminApiThetaVaultsInversifyService.isReadyDescription(),
    }
  }

  @preDestroy()
  async destroy() {
    this.cleanups.forEach(c => c())
    await this.lastPromise
  }

  public getTradingCompetitionInfo({
    fromTimestamp,
    debug,
  }: TradingCompetitionInfoParameters): TradingCompetitionInfoAddress[] {
    // @ts-expect-error
    const allVtEventsAsc: AllVtEvents[] = Array.from(
      this.cviAdminApiVolatilityTokensInversifyService.data.values(),
    ).sort(sortEventsAsc)
    const updateGeneralInfoOfEventAndAddresses: UpdateGeneralInfoOfEventAndAddressesDto =
      this.latestGeneralInfoOfEventByAddressInversifyService.getUpdateGeneralInfoOfEventAndAddresses()
    const addresses = Array.from(
      new Set(
        [...this.latestGeneralInfoOfEventByAddressInversifyService.latestGeneralInfoOfEventByAddress.keys()].filter(
          address => {
            const g = getAddressGroupAndName(address, this.cviContractsInversifyService).addressGroup
            return [AddressGroup.COMMUNITY, AddressGroup.USERS, AddressGroup.GNOSIS_SAFE].includes(g)
          },
        ),
      ),
    )
    return addresses
      .map<TradingCompetitionInfoAddress>(address => {
        // @ts-expect-error
        const addressEventsAsc: AllVtEvents[] =
          this.cviAdminApiVolatilityTokensInversifyService.addressToEventsAsc.get(address) ?? []

        const eventsInBetweenAsc = addressEventsAsc.filter(
          e => fromTimestamp === undefined || fromTimestamp <= e.blockTimestamp,
        )

        const maxTradeUsdc = Math.max(
          0,
          ...eventsInBetweenAsc.flatMap(e =>
            (e.type === CviBackendClientApi.VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ? [e] : []).map(e =>
              e.args.tokenNameAmountIn === CviBackendClientApi.VtUniswapSwapEventArgsDto.tokenNameAmountIn.CVI
                ? e.args.tokenAmountIn * e.args.generalInfoOfEvent.vtCviPriceInUsdc
                : e.args.tokenAmountIn,
            ),
          ),
          ...eventsInBetweenAsc.flatMap(e =>
            (e.type === CviBackendClientApi.VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT ? [e] : []).map(e =>
              e.args.action === CviBackendClientApi.SubmitRequestEventDto.action.BURN
                ? e.args.tokenAmountPaid * e.args.generalInfoOfEvent.vtCviPriceInUsdc
                : e.args.tokenAmountPaid,
            ),
          ),
        )

        const vtStatisticsApi = new VtStatisticsApi(
          allVtEventsAsc,
          eventsInBetweenAsc,
          this.cviContractsInversifyService,
          new Map(
            updateGeneralInfoOfEventAndAddresses.updatedGeneralInfoOfEventByAddress.map(a => [
              a.address,
              a.generalInfoOfEventByAddress,
            ]),
          ),
          [address],
        )

        const pnl = vtStatisticsApi.calculateTradersPnlUsdc()

        return {
          address,
          maxTradeUsdc,
          pnlUsdc: pnl.pnlInUsdc,
          trades: eventsInBetweenAsc.filter(
            e =>
              e.type === CviBackendClientApi.VtMintEventDto.type.VT_MINT_EVENT ||
              e.type === CviBackendClientApi.VtBurnEventDto.type.VT_BURN_EVENT ||
              e.type === CviBackendClientApi.VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT,
          ).length,
          ...(debug && { pnlInfo: pnl }),
          tvCvix1BalanceInUsdc:
            this.latestGeneralInfoOfEventByAddressInversifyService.latestGeneralInfoOfEventByAddress.get(address)
              ?.generalInfoOfEventByAddress.tvCvix1BalanceInUsdc ?? 0,
        }
      })
      .filter(r => r.maxTradeUsdc >= 50)
      .sort((a, b) => b.pnlUsdc - a.pnlUsdc)
  }
}
