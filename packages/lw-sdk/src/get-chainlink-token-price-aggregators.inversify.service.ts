import { inject, injectable } from 'inversify'
import type * as GitContractTypes from '@coti-cvi/auto-generated-code/contracts'
import type { ChainId } from './types'
import { CHAIN_IDS_INFO } from './types'
import { getContractFromAddressAndAbi, toNumber } from './util'
import { chainlinkTokensPriceAggregatorAbi } from './common-abis/chainlink-tokens-price-aggregator.abi'
import type { JsonRpcProvider } from '@ethersproject/providers'
import type { CallOverrides } from 'ethers'
import { USD_PRICE_AGGREGATORS_BY_CHAIN } from './contracts-deploy-utils'

export type ChainlinkTokensPriceAggregator = GitContractTypes.USDUSDOracle

export type Pairs = 'USDC-USD' | 'ETH-USD' | 'DAI-USD' | 'USDT-USD'

type ChainlinkTokensPriceAggregators = Record<Pairs, ChainlinkTokensPriceAggregator>

@injectable()
export class GetChainlinkTokenPriceAggregatorsInversifyService {
  public readonly chainlinkTokensPriceAggregators: ChainlinkTokensPriceAggregators

  constructor(
    @inject('EthersJsonRpcBatchProvider') public readonly provider: JsonRpcProvider,
    @inject('ChainId') chainId: ChainId,
  ) {
    const aggregatorAddresses = USD_PRICE_AGGREGATORS_BY_CHAIN[CHAIN_IDS_INFO[chainId].blockchainName]

    this.chainlinkTokensPriceAggregators = Object.fromEntries(
      Object.entries(aggregatorAddresses).map(([key, address]) => [
        `${key}-USD`,
        this.getChainlinkTokensPriceAggregatorAbi(address, `${key}-USD`),
      ]),
    ) as ChainlinkTokensPriceAggregators
  }

  public async getPrice(pair: Pairs, blockTag?: CallOverrides['blockTag']): Promise<number> {
    const aggregator = this.chainlinkTokensPriceAggregators[pair]
    const [decimals, { answer }] = await Promise.all([
      aggregator.decimals({ blockTag }),
      aggregator.latestRoundData({ blockTag }),
    ])
    return toNumber(answer, decimals)
  }

  private getChainlinkTokensPriceAggregatorAbi(address: string, contractName?: string): ChainlinkTokensPriceAggregator {
    return getContractFromAddressAndAbi(address, chainlinkTokensPriceAggregatorAbi, this.provider, contractName)
  }
}
