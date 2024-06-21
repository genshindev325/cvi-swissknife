import nock from 'nock'
import type { IlLpTokensInfoOfAccountAddress } from '../../src'
import { ArmadilloSupportedTokenName } from '../../src'
import { CustomError, SupportedZapperProtocolNames } from '../../src'
import { beforeAfterEach } from './utils'
import { StatusCodes } from 'http-status-codes'
import { createMockedZapperV2BalancesResponse } from './zapper-balances-response-data/v2/zapper-responses'

describe('zapper v2 basic test - expect defi holding reported correctly for address', () => {
  const { getZapperApiInversifyService } = beforeAfterEach({
    // this is true only for this specific test!!!
    ignoreErrorsDuringTest: true,
  })
  test('basic zapper v2 test - single address with defi holdings', async () => {
    const ethAddress = '0x72b31859c516947ce37a13bf0e6d4ad51d151a8e'.toLocaleLowerCase()

    const zapperResponse = createMockedZapperV2BalancesResponse(ethAddress)
    const url = new URL(getZapperApiInversifyService().buildZapperRequestUrl([ethAddress]))

    nock(url.origin)
      .get(url.pathname + url.search)
      .reply(StatusCodes.OK, zapperResponse)

    const result = await getZapperApiInversifyService()
      .getLpTokensInfoForIL([ethAddress])
      .catch(error => {
        CustomError.printErrorToConsole(error)
        throw error
      })

    expect(result.holdings).toHaveLength(1)
    expect(result.holdings).toEqual(
      expect.arrayContaining<IlLpTokensInfoOfAccountAddress>([
        {
          forAccountAddress: ethAddress,
          lpTokensInfo: [
            {
              BlockchainName: 'polygon',
              SupportedZapperProtocolNames: SupportedZapperProtocolNames.QUICKSWAP,
              balanceUSD0: 0.164716552,
              balanceUSD1: 0.16489824409412807,
              balanceUSDTotal: 0.3296152314493867,
              balanceUnits0: 0.164552,
              balanceUnits1: 0.000143045225061485,
              symbol0: { ArmadilloSupportedTokenName: ArmadilloSupportedTokenName.USDC },
              symbol1: { ArmadilloSupportedTokenName: ArmadilloSupportedTokenName.WETH },
              id: 'address::0x72b31859c516947ce37a13bf0e6d4ad51d151a8e-balanceUSDTotal::0.3296-balanceUSD0::0.1647-balanceUSD1::0.1649-balanceUnits0::0.164552-balanceUnits1::0.000143045225061485-token0::USDC-token1::WETH-BlockchainName::polygon-SupportedZapperProtocolNames::quickswap',
            },
            {
              BlockchainName: 'polygon',
              SupportedZapperProtocolNames: SupportedZapperProtocolNames.QUICKSWAP,
              balanceUSD0: 0.08245941791236867,
              balanceUSD1: 0.0824899009288148,
              balanceUSDTotal: 0.1649493188411835,
              balanceUnits0: 0.000071531543944038,
              balanceUnits1: 0.08240749343537943,
              symbol0: { ArmadilloSupportedTokenName: ArmadilloSupportedTokenName.WETH },
              symbol1: { ArmadilloSupportedTokenName: ArmadilloSupportedTokenName.DAI },
              id: 'address::0x72b31859c516947ce37a13bf0e6d4ad51d151a8e-balanceUSDTotal::0.1649-balanceUSD0::0.0825-balanceUSD1::0.0825-balanceUnits0::0.000071531543944038-balanceUnits1::0.08240749343537943-token0::WETH-token1::DAI-BlockchainName::polygon-SupportedZapperProtocolNames::quickswap',
            },
            {
              BlockchainName: 'polygon',
              SupportedZapperProtocolNames: SupportedZapperProtocolNames.QUICKSWAP,
              balanceUSD0: 0.08185659213540605,
              balanceUSD1: 0.081742,
              balanceUSDTotal: 0.1635985491486608,
              balanceUnits0: 0.000071008607211678,
              balanceUnits1: 0.081742,
              symbol0: { ArmadilloSupportedTokenName: ArmadilloSupportedTokenName.WETH },
              symbol1: { ArmadilloSupportedTokenName: ArmadilloSupportedTokenName.USDT },
              id: 'address::0x72b31859c516947ce37a13bf0e6d4ad51d151a8e-balanceUSDTotal::0.1636-balanceUSD0::0.0819-balanceUSD1::0.0817-balanceUnits0::0.000071008607211678-balanceUnits1::0.081742-token0::WETH-token1::USDT-BlockchainName::polygon-SupportedZapperProtocolNames::quickswap',
            },
          ],
        },
      ]),
    )
  })
})
