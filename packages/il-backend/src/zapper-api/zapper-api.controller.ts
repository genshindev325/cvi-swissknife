import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger'
import type { IArmadilloSupportedTokenName, IlLpTokensInfoOfAccountAddress, LpTokenInfo } from '@coti-cvi/lw-sdk'
import { ArmadilloSupportedTokenName } from '@coti-cvi/lw-sdk'
import { BlockchainName, SupportedZapperProtocolNames } from '@coti-cvi/lw-sdk'
import type { PrometheusService } from '../prometheus/prometheus.service'
import {
  disallowStringArrayWithDuplicatesPipe,
  transformParamToArray as transformParamToArray,
  verifyValidEthersWalletsIdsPipe,
} from '@coti-cvi/common-be'
import { startTimer } from '@coti-cvi/lw-sdk'
import type { InitInversifyReturnType } from '../inversify/init-inversify.service'

class ArmadilloSupportedTokenNameDto implements IArmadilloSupportedTokenName {
  @ApiProperty({ type: String, enum: Object.values(ArmadilloSupportedTokenName) })
  ArmadilloSupportedTokenName!: ArmadilloSupportedTokenName
}
class LpTokensInfoDto implements LpTokenInfo {
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: ArmadilloSupportedTokenNameDto })
  symbol0!: ArmadilloSupportedTokenNameDto

  @ApiProperty({ type: ArmadilloSupportedTokenNameDto })
  symbol1!: ArmadilloSupportedTokenNameDto

  @ApiProperty({ type: Number })
  balanceUSD0!: number

  @ApiProperty({ type: Number })
  balanceUSD1!: number

  @ApiProperty({ type: Number })
  balanceUnits0!: number

  @ApiProperty({ type: Number })
  balanceUnits1!: number

  @ApiProperty({ type: Number })
  balanceUSDTotal!: number

  @ApiProperty({ type: String, enum: BlockchainName })
  BlockchainName!: BlockchainName

  @ApiProperty({ type: String, enum: SupportedZapperProtocolNames })
  SupportedZapperProtocolNames!: SupportedZapperProtocolNames
}

class IlLpTokensInfoOfAccountAddressDto implements IlLpTokensInfoOfAccountAddress {
  @ApiProperty({ type: String })
  forAccountAddress!: string

  @ApiProperty({ type: LpTokensInfoDto, isArray: true })
  lpTokensInfo!: LpTokenInfo[]
}

@ApiTags(`Zapper-Api`)
@Controller('/zapper-api')
export class ZapperApiController {
  constructor(
    @Inject('InversifyContainerNestJsToken') private readonly inversifyContainer: InitInversifyReturnType,
    @Inject('PrometheusServiceToken') private readonly prometheusService: PrometheusService,
  ) {}

  @Get('/accounts-lps')
  @ApiOperation({
    description: `For given EVM addresses, return all supported il-product pairs and their liquidity providing balances. To get an EVM address that that supplies Liquidity in defi go to one of the CONTRACT_ADDRESSES for the supported pairs, e.g: https://etherscan.io/address/0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852 and pick any EVM address in the transactions list`,
  })
  @ApiQuery({
    name: 'account-addresses',
    required: true,
    isArray: true,
    type: String,
  })
  @ApiResponse({ type: IlLpTokensInfoOfAccountAddressDto, isArray: true })
  public async accountsLps(
    @Query(
      'account-addresses',
      transformParamToArray(),
      disallowStringArrayWithDuplicatesPipe(),
      verifyValidEthersWalletsIdsPipe(),
    )
    accounts: string[],
  ): Promise<IlLpTokensInfoOfAccountAddressDto[]> {
    const endTimer = startTimer()
    const zapper = await this.inversifyContainer.getAsync('ZapperApiInversifyService')
    const number_of_accounts = accounts.length

    try {
      const { holdings } = await zapper.getLpTokensInfoForIL(accounts)

      this.prometheusService.zapperAccountLpRequests
        .labels({
          success: 'true',
          http_status_code: 200,
          number_of_accounts,
        })
        .inc()

      this.prometheusService.zapperAccountLpRequestDurationSeconds
        .labels({ success: 'true', number_of_accounts })
        .observe(endTimer())

      return holdings
    } catch (error) {
      this.prometheusService.zapperAccountLpRequests
        .labels({
          success: 'false',
          http_status_code: error?.httpStatus ? error?.httpStatus : 500,
          number_of_accounts,
        })
        .inc()

      this.prometheusService.zapperAccountLpRequestDurationSeconds
        .labels({ success: 'false', number_of_accounts })
        .observe(endTimer())

      throw error
    }
  }
}
