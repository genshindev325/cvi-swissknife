import { inject, injectable, postConstruct, preDestroy } from 'inversify'
import type { BancorNetworkEthMainnet, BancorPoolCollectionEthMainnet } from '@coti-cvi/auto-generated-code'
import type { Address } from './types'
import { ChainId, CHAIN_IDS_INFO } from './types'
import { getContractFromAddressAndAbi, startTimer } from './util'
import { JsonRpcProvider } from '@ethersproject/providers'
import BancorNetworkEthMainnetAbiJson from './common-abis/BancorNetworkEthMainnet.json'
import BancorPoolCollectionEthMainnetAbiJson from './common-abis/BancorPoolCollectionEthMainnet.json'
import type { GlobalEventsInversifyService } from './global-events.inversify.service'

@injectable()
export class ArmadilloEligibleDiscountInversifyService {
  private id: NodeJS.Timeout | undefined

  private lastPromise: Promise<unknown> | undefined

  public readonly bancorNetworkContract: BancorNetworkEthMainnet

  public readonly eligibleAddresses = new Set<Address>()

  private readonly ethProvider = new JsonRpcProvider(CHAIN_IDS_INFO[ChainId.EthereumMainnet].cviRpcUrl)

  private _isReady = false

  constructor(
    @inject('GlobalEventsInversifyService') public readonly globalEventsInversifyService: GlobalEventsInversifyService,
  ) {
    this.bancorNetworkContract = getContractFromAddressAndAbi(
      '0xeEF417e1D5CC832e619ae18D2F140De2999dD4fB',
      BancorNetworkEthMainnetAbiJson,
      this.ethProvider,
      'bancorNetworkContract',
    )
  }

  public isReady() {
    return this._isReady
  }

  private getPoolCollectionContract(address: string): BancorPoolCollectionEthMainnet {
    return getContractFromAddressAndAbi(address, BancorPoolCollectionEthMainnetAbiJson, this.ethProvider)
  }

  @postConstruct()
  public init() {
    const get = async () => {
      const addresses = await Promise.all([this.getBancorLiquidityProvidersAddresses()]).then(r => r.flat())

      for (const address of addresses) {
        this.eligibleAddresses.add(address.toLowerCase())
      }
    }

    const manage = async () => {
      if (this.lastPromise) {
        return
      }
      try {
        const e = startTimer()
        this.lastPromise = get()
        await this.lastPromise
        if (!this._isReady) {
          this._isReady = true
          console.log(
            `${new Date().toISOString()} - ${
              ArmadilloEligibleDiscountInversifyService.name
            } - ready - eligible addresses: ${this.eligibleAddresses.size} (${e().toFixed(0)}s)`,
          )
        }
      } catch (error) {
        this.globalEventsInversifyService.eventEmitter.emit('errors', error)
      } finally {
        this.lastPromise = undefined
      }
    }

    this.id = setInterval(manage, 60_000)

    manage()
  }

  @preDestroy()
  public async onDestory() {
    this.ethProvider.removeAllListeners()
    if (this.id) {
      clearInterval(this.id)
    }
    await this.lastPromise
  }

  public async getBancorLiquidityProvidersAddresses() {
    const poolsAdded = await this.bancorNetworkContract.queryFilter(this.bancorNetworkContract.filters.PoolAdded())
    const uniquePoolCollections = [...new Set(poolsAdded.map(p => p.args.poolCollection))]
    const result = await Promise.all(
      uniquePoolCollections
        .map(p => this.getPoolCollectionContract(p))
        .map(poolCollectionContract =>
          poolCollectionContract.queryFilter(poolCollectionContract.filters.TokensDeposited()),
        ),
    ).then(r => r.flat())

    const r = [...new Set(result.map(r => r.args.provider))]

    console.log(
      `${new Date().toISOString()} - ${
        ArmadilloEligibleDiscountInversifyService.name
      } - fetched eligible addresses from bancor: ${r.length}`,
    )

    return r
  }
}
