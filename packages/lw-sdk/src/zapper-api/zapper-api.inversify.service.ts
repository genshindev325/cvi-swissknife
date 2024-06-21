import { inject, injectable, optional } from 'inversify'
import { CustomError, ErrorKind } from '../custom-error'
import { ArmadilloSupportedTokenName, TokenName } from '../types'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry'
import type { LpTokenInfo, IlLpTokensInfoOfAccountAddress, ProtocolPayload } from './types'
import { SupportedZapperProtocolNames } from './types'
import { v4 as uuidv4 } from 'uuid'
import type { GlobalEventsInversifyService } from '../global-events.inversify.service'
import os from 'os'
import { fixTokenName } from '../util'

export const generateZapperResponseId = (
  lpToken: Omit<LpTokenInfo, 'id'> & {
    accountAddress: string
  },
) =>
  `address::${lpToken.accountAddress}-balanceUSDTotal::${lpToken.balanceUSDTotal.toFixed(
    4,
  )}-balanceUSD0::${lpToken.balanceUSD0.toFixed(4)}-balanceUSD1::${lpToken.balanceUSD1.toFixed(4)}-balanceUnits0::${
    lpToken.balanceUnits0
  }-balanceUnits1::${lpToken.balanceUnits1}-token0::${lpToken.symbol0.ArmadilloSupportedTokenName}-token1::${
    lpToken.symbol1.ArmadilloSupportedTokenName
  }-BlockchainName::${lpToken.BlockchainName}-SupportedZapperProtocolNames::${lpToken.SupportedZapperProtocolNames}`

export const TokenAliases: Record<TokenName.WETH, string[]> = {
  [TokenName.WETH]: ['ETH'],
}

@injectable()
export class ZapperApiInversifyService {
  // zapper v1
  public readonly SUPPORTED_ASSET_TYPE = 'liquidity-pool'

  // zapper v2
  public readonly SUPPORTED_ASSET_TYPE_ZAPPER_V2: string = 'Liquidity'

  public readonly ZAPPER_V2_EVENT__BALANCE: string = `event: balance`

  private currentZapperAPIKeyIndex = 0

  constructor(
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('ZapperApiKeys') private readonly zapperApiKeys: string[],
    @inject('ZapperProxy')
    @optional()
    private readonly zapperProxy?: { host: string; port: number; auth?: { username: string; password: string } },
  ) {}

  private findTokenByAlias(alias: string): ArmadilloSupportedTokenName | undefined {
    const upperCase = alias.toLocaleUpperCase()

    const result =
      Object.entries(TokenAliases).find(
        ([tokenName, aliases]) =>
          tokenName.toLocaleUpperCase() === upperCase || aliases.map(x => x.toLocaleUpperCase()).includes(upperCase),
      )?.[0] ?? upperCase

    const supportedTokenName = Object.values(TokenName).find(r => r === result)
    if (supportedTokenName && supportedTokenName !== TokenName.CVI) {
      const fixed = fixTokenName(supportedTokenName)
      return Object.values(ArmadilloSupportedTokenName).find(r => r === fixed)
    }
    return undefined
  }

  public async getLpTokensInfoForIL(addresses: string[]): Promise<{ holdings: IlLpTokensInfoOfAccountAddress[] }> {
    try {
      // remove duplicate while preserving the initial addresses because that's what the caller is expecting
      const accountAddresses: string[] = addresses.filter(address => addresses.filter(x => x === address).length === 1)

      return await this.getZapperBalancesV2(accountAddresses)
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw new CustomError({
        name: 'ZapperApiInversifyServiceError',
        message: 'Error in getLpTokensInfoForIL',
        cause: error,
        errorKind: ErrorKind.SystemError,
        extras: {
          addresses,
          zapperMessage: error.response?.data?.message,
        },
      })
    }
  }

  private isSupportedZapperProtocolName(protocolName: string): boolean {
    const supportedZapperProtocolName = Object.values(SupportedZapperProtocolNames).find(s => protocolName === s)
    return !!supportedZapperProtocolName
  }

  public buildZapperRequestUrl(accountAddress: string[]): string {
    const v2PossibleNetworks = [
      'ethereum',
      'polygon',
      'optimism',
      'gnosis',
      'binance-smart-chain',
      'fantom',
      'avalanche',
      'arbitrum',
      'celo',
      'harmony',
      'moonriver',
      'bitcoin',
      'cronos',
      'aurora',
      'evmos',
    ]
    const keyZapper = this.getCurrentZapperAPIKey()

    return `https://api.zapper.fi/v2/balances?api_key=${keyZapper}${accountAddress
      .map(t => `&addresses%5B%5D=${t}`)
      .join('&')}&bundled=false&retry=2&${v2PossibleNetworks.map(n => `networks%5B%5D=${n}`).join('&')}`
  }

  private getCurrentZapperAPIKey(): string {
    if (this.currentZapperAPIKeyIndex >= this.zapperApiKeys.length) {
      this.currentZapperAPIKeyIndex = 0
    }
    const useKey = this.zapperApiKeys[this.currentZapperAPIKeyIndex]
    this.currentZapperAPIKeyIndex += 1
    console.log(`Using Zapper API key: ${useKey}`)
    return useKey
  }

  /**
   * returns the balance of the specified wallet public-id
   * @param {*} accountAddress str
   * @returns an array containing data on each asset at the wallet.
   *
   */
  private zapperBalancesAxiosResponsePromise(accountAddresses: string[]): {
    axiosResponsePromise: Promise<AxiosResponse<string, string>>
    uuid: string
  } {
    const uuid = uuidv4()

    const url = this.buildZapperRequestUrl(accountAddresses)

    const proxy: { host: string; port: number; auth?: { username: string; password: string } } | undefined = this
      .zapperProxy
      ? {
          host: this.zapperProxy.host,
          port: this.zapperProxy.port,
          auth: this.zapperProxy.auth
            ? { username: this.zapperProxy.auth.username, password: this.zapperProxy.auth.password }
            : undefined,
        }
      : undefined

    console.log(
      `${new Date().toISOString()} - ${uuid} - Zapper ${proxy ? '(p)' : ''} - ${
        accountAddresses.length
      } addr/s: ${accountAddresses}`,
    )

    const client = axios.create()
    axiosRetry(client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: error => {
        // @ts-ignore
        const zapperResponseErrorMessage = error.response?.data?.message
        const isRetry =
          !zapperResponseErrorMessage &&
          (isNetworkOrIdempotentRequestError(error) ||
            (error.response && error.response?.status === 502 ? true : false))
        console.error(
          `${new Date().toISOString()} - ${uuid} - Zapper ${proxy ? '(p)' : ''} - ${
            accountAddresses.length
          } addr/s: ${accountAddresses} - (Retry=${isRetry}${
            !isRetry && zapperResponseErrorMessage ? ` because of "${zapperResponseErrorMessage}"` : ``
          }) `,
        )
        return isRetry
      },
    })
    return { axiosResponsePromise: client.get(url, { proxy }), uuid }
  }

  private async getZapperBalancesV2(
    accountAddresses: string[],
  ): Promise<{ holdings: IlLpTokensInfoOfAccountAddress[] }> {
    const { axiosResponsePromise, uuid } = this.zapperBalancesAxiosResponsePromise(accountAddresses)

    const body = await axiosResponsePromise

    const retValue: { holdings: IlLpTokensInfoOfAccountAddress[] } = { holdings: [] }

    let iLLpTokensForSpecificAddr: IlLpTokensInfoOfAccountAddress[] = []

    console.log(
      `${new Date().toISOString()} - ${uuid} - Zapper V2 used to fetch ${accountAddresses.length} address/es - ${
        body.data.length
      } bytes balances response`,
    )

    for (const specificAddress of accountAddresses) {
      iLLpTokensForSpecificAddr = await this.getBalancePerProtocolForV2(body.data, specificAddress)

      const r = iLLpTokensForSpecificAddr.map(ele => ({
        forAccountAddress: ele.forAccountAddress,
        lpTokensInfo: ele.lpTokensInfo.sort((a, b) => b.balanceUSDTotal - a.balanceUSDTotal),
      }))[0]

      retValue.holdings.push(r)
    }

    return retValue
  }

  private getBalancePerProtocolForV2(
    rawResponseNotJson: string,
    forAccountAddress: string,
  ): IlLpTokensInfoOfAccountAddress[] {
    const prefixString = 'data: {'
    const endOfPrefixIndex = prefixString.length
    const zapperResponseStrings: string[] = []
    let zapperResponse = []

    const zapperResponseLines: string[] = rawResponseNotJson.split(os.EOL)
    for (let lineNumber = 0; lineNumber < zapperResponseLines.length; lineNumber++) {
      const line = zapperResponseLines[lineNumber]
      if (line.startsWith(prefixString)) {
        // Check that previous Zapper response line was "event: protocol"
        if (lineNumber - 1 < 0) {
          throw new Error('Zapper response is not valid. Data record must have event: record one line before')
        }

        if (zapperResponseLines[lineNumber - 1].startsWith(this.ZAPPER_V2_EVENT__BALANCE)) {
          zapperResponseStrings.push(line)
        }
      }
    }
    // just to output holdings in Zapper's address found format (regardless of us submitting lowercase/uppercase)
    let forAccountAddressInZapperResponse: string | undefined = undefined

    zapperResponse = zapperResponseStrings
      .map(line => {
        const jsonStr = line.slice(endOfPrefixIndex - 1)

        try {
          const jsonData = JSON.parse(jsonStr)

          if (jsonData.hasOwnProperty('appId')) {
            if (jsonData.addresses[0].toLowerCase() === forAccountAddress.toLowerCase()) {
              if (!forAccountAddressInZapperResponse) {
                forAccountAddressInZapperResponse = jsonData.addresses[0]
              }
              // NOTE: jsonData.appId could be "tokens"
              if (this.isSupportedZapperProtocolName(jsonData.appId)) {
                return jsonData
              }
            }
          }
          return undefined
        } catch (e) {
          const supportedZapperProtocolName = Object.values(SupportedZapperProtocolNames).find(s =>
            jsonStr.includes(`"${s}"`),
          )
          if (supportedZapperProtocolName) {
            this.globalEventsInversifyService.eventEmitter.emit(
              'errors',
              new CustomError({
                name: 'Json-parse-zapper-response-error',
                message: 'Error while parsing json of zapper v2 response',
                cause: e,
                errorKind: ErrorKind.SystemError,
                extras: {
                  supportedZapperProtocolName,
                  problematicJson: jsonStr,
                  fullZapperResponse: rawResponseNotJson,
                },
              }),
            )
          } else {
            // ignore error
          }
          return false
        }
      })
      .filter(r => Boolean(r))

    zapperResponse = zapperResponse
      .filter(item => Boolean(item.app))
      .filter(item => this.isSupportedZapperProtocolName(item.app.appId))

    zapperResponse = zapperResponse.map(r => {
      return {
        ...r,
        appId: r.appId,
        network: r.network,
        data: r.app.data,
        displayProps: {
          appName: r.app.displayProps.appName,
          images: r.app.displayProps.images,
        },
        meta: {
          total: r.app.meta.total,
        },
        // @ts-ignore
        balances: Object.entries(r.app?.data).map(x => ({ address: r.addresses[0], balance: x[1].balanceUSD })),
      }
    })

    const protocolsPayload: ProtocolPayload[] = zapperResponse

    // v2 validate
    // const validate = this.ajv.compile(zapperV1ResponseSchema)
    // if (!validate(zapperResponse)) {
    //   throw new CustomError({
    //     name: 'config-error',
    //     errorKind: ErrorKind.SystemError,
    //     message: 'failed to validate zapper v2 response',
    //     extras: {
    //       actualAjvErrorMessage: betterAjvErrors({
    //         errors: validate.errors,
    //         data: zapperResponse,
    //         // @ts-ignore
    //         schema: zapperV1ResponseSchema,
    //       }),
    //       zapperResponse,
    //     },
    //   })
    // }
    const lpTokensInfo: LpTokenInfo[] = []
    for (const protocolPayload of protocolsPayload) {
      const protocolName = protocolPayload.appId
      if (!this.isSupportedZapperProtocolName(protocolName)) {
        continue
      }
      //      let currIndex = 0
      for (const protocolData of protocolPayload.data) {
        // currIndex++
        // console.log(
        //   `======================================================\n${protocolName} --> protocolPayload.data loop on item ${currIndex}/${protocolPayload.data.length} - ${protocolData.appId} and ${protocolData.displayProps.label} \nprotocolData.displayProps.stats.length: ${protocolData.displayProps.stats.length}\n======================================================\n`,
        // )
        let isSupplyingLiquidity = false

        //const isSupportedZapperProtocol = this.isSupportedZapperProtocolName(protocolData.appId)

        //console.log(`protocolData.displayProps.stats.length: ${protocolData.displayProps.stats.length}`)
        if (protocolData.displayProps.stats.length > 0) {
          protocolData.displayProps.stats.forEach(stats => {
            if (stats.label.value == this.SUPPORTED_ASSET_TYPE_ZAPPER_V2) {
              isSupplyingLiquidity = true
            }
          })

          if (isSupplyingLiquidity) {
            const tokens: { balanceUSD: number; symbol: ArmadilloSupportedTokenName; balanceUnits: number }[] =
              protocolData.breakdown
                .map(token => {
                  return {
                    balanceUSD: token.balanceUSD,
                    // @ts-ignore
                    symbol: token.context!.symbol,
                    // @ts-ignore
                    balanceUnits: token.context!.balance,
                  }
                })
                .filter(token => this.findTokenByAlias(token.symbol))
                .map(info => ({
                  ...info,
                  symbol: fixTokenName(info.symbol),
                }))

            if (tokens.length === 2) {
              const protocolName = Object.values(SupportedZapperProtocolNames).find(r => r === protocolPayload.appId)
              if (protocolName) {
                const BlockchainName: string = protocolPayload.network
                const r: Omit<LpTokenInfo, 'id'> = {
                  symbol0: { ArmadilloSupportedTokenName: tokens[0].symbol },
                  symbol1: { ArmadilloSupportedTokenName: tokens[1].symbol },
                  balanceUSD0: tokens[0].balanceUSD,
                  balanceUSD1: tokens[1].balanceUSD,
                  balanceUSDTotal: protocolData.balanceUSD,
                  balanceUnits0: tokens[0].balanceUnits,
                  balanceUnits1: tokens[1].balanceUnits,

                  BlockchainName,
                  SupportedZapperProtocolNames: protocolName,
                }
                lpTokensInfo.push({
                  ...r,
                  id: generateZapperResponseId({
                    ...r,
                    accountAddress:
                      forAccountAddressInZapperResponse === undefined
                        ? forAccountAddress
                        : forAccountAddressInZapperResponse,
                  }),
                })
              }
            }
          }
        }
      }
    }
    return [
      {
        lpTokensInfo,
        forAccountAddress:
          forAccountAddressInZapperResponse === undefined ? forAccountAddress : forAccountAddressInZapperResponse,
      },
    ]
  }
}
