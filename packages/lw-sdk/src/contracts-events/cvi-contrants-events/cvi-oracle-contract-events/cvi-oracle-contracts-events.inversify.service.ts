import type { BlockchainContractEventsCacheUtils, CVIOracleInversifyService } from '@coti-cvi/lw-sdk'
import type { TypedListener } from 'auto-generated-code/src/git-contract-types/common'
import { inject, injectable } from 'inversify'
import { StrictEventEmitter } from 'strict-event-emitter'
import type { GlobalEventsInversifyService } from '../../../global-events.inversify.service'
import type { ChainId } from '../../../types'
import { CHAIN_IDS_INFO, NetworkName, REDIS_INVALIDATION_KEY_BY_CHAIN_ID } from '../../../types'

import type { FormatCviOracleContractsEventsInversifyService } from './format-cvi-oracle-contracts-events.inversify.service'
import type { AnswerUpdatedEvent } from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/contracts/oracle/CVIFeedOracleContracts.sol/CVIDeviationOracle'
import type { CviOracleEventsEmitterType } from '../../types'
import range from 'lodash/range'
import type { CviOracle } from '@coti-cvi/auto-generated-code'
import { startTimer } from '../../../util'

@injectable()
export class CviOracleContractsEventsInversifyService {
  public realTimeEventEmitter = new StrictEventEmitter<CviOracleEventsEmitterType>()

  public oldEventsIds = new Set<string>()

  constructor(
    @inject('ChainId') public readonly chainId: ChainId,
    @inject('FormatCviOracleContractsEventsInversifyService')
    private readonly formatCviOracleContractsEventsInversifyService: FormatCviOracleContractsEventsInversifyService,
    @inject('GlobalEventsInversifyService') readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('CVIOracleInversifyService') private readonly cviOracleInversifyService: CVIOracleInversifyService,
    @inject('BlockchainContractEventsCacheUtils')
    private readonly blockchainContractEventsCacheUtils: BlockchainContractEventsCacheUtils,
  ) {}

  public registerNewCviOracleEvent() {
    const pollingTimer = setTimeout(() => {
      this.getOldCviIndexEvents()
    }, 60_000 * 10)

    const aggregator = this.cviOracleInversifyService.getAggregator() as CviOracle
    const filter = aggregator.filters.AnswerUpdated()

    const listener: TypedListener<AnswerUpdatedEvent> = async (...params) => {
      const event = params[3]

      const id = `CviOracleNewRound::${event.blockNumber}::${event.transactionIndex}::${event.args.current}`

      if (this.oldEventsIds.has(id)) {
        return
      }

      this.oldEventsIds.add(id)

      this.realTimeEventEmitter.emit(
        'CviOracleAnswerEvent',
        await this.formatCviOracleContractsEventsInversifyService.toFormattedCviIndexEvent(event),
      )
    }

    aggregator.on(filter, listener)

    return () => {
      aggregator.off(filter, listener)
      clearTimeout(pollingTimer)
    }
  }

  public async getOldCviIndexEvents() {
    if (CHAIN_IDS_INFO[this.chainId].networkName !== NetworkName.Mainnet) {
      return []
    }

    const end = startTimer()
    console.log(`${new Date().toISOString()} - start fetching cvi-oracle-events`)
    const formattedAndSortedBlockchainEvents =
      await this.blockchainContractEventsCacheUtils.getCviOracleEventsFromCache(
        REDIS_INVALIDATION_KEY_BY_CHAIN_ID[this.chainId]['cvi-oracle-events-group'],
      )

    if (formattedAndSortedBlockchainEvents.length > 0) {
      console.log(
        `${new Date().toISOString()} - fetched cache ${
          formattedAndSortedBlockchainEvents.length
        } cvi-oracle-events from blockNumber: ${0} to blockNumber: ${
          formattedAndSortedBlockchainEvents[formattedAndSortedBlockchainEvents.length - 1].blockNumber
        }`,
      )
    } else {
      console.log(`${new Date().toISOString()} - No cached events were fetched from cvi-oracle`)
    }

    const cviOracleAggregator = this.cviOracleInversifyService.getAggregator()

    const startBlockNumber =
      formattedAndSortedBlockchainEvents.length > 0
        ? formattedAndSortedBlockchainEvents[formattedAndSortedBlockchainEvents.length - 1].blockNumber + 1
        : await cviOracleAggregator
            .queryFilter(cviOracleAggregator.filters.AnswerUpdated(undefined, 1))
            .then(r => r[0].blockNumber)

    const blockNumberNow = await this.cviOracleInversifyService.getContractInversifyService.provider.getBlockNumber()
    const requests = formattedAndSortedBlockchainEvents.length < 10_000 ? 80 : 1
    const interval = Math.floor((blockNumberNow - startBlockNumber) / requests)
    const rangeArray = range(startBlockNumber, blockNumberNow, interval)
    const pages = rangeArray.length
    let finishedPages = 0
    const missingCviOracleEvents = await Promise.all(
      rangeArray.map(startBlockNumber => {
        const toBlockNumber = startBlockNumber + interval
        const e = startTimer()
        console.log(
          `${new Date().toISOString()} - fetching cvi-oracle-events from blockNumber: ${startBlockNumber} to blockNumber: ${toBlockNumber} (${
            toBlockNumber - startBlockNumber
          } blocks)`,
        )
        return cviOracleAggregator
          .queryFilter(cviOracleAggregator.filters.AnswerUpdated(), startBlockNumber, toBlockNumber)
          .then(r =>
            Promise.all(r.map(e => this.formatCviOracleContractsEventsInversifyService.toFormattedCviIndexEvent(e))),
          )
          .then(r => {
            finishedPages++
            console.log(
              `${new Date().toISOString()} - fetched ${
                r.length
              } cvi-oracle-events from blockNumber: ${startBlockNumber} to blockNumber: ${toBlockNumber} - (${finishedPages}/${pages} pages) (${e().toFixed(
                2,
              )}s)`,
            )
            return r
          })
      }),
    ).then(r => r.flat())

    const allCviOracleEvents = formattedAndSortedBlockchainEvents
      .concat(missingCviOracleEvents)
      .sort((e1, e2) => e1.blockNumber - e2.blockNumber)

    for (const e of allCviOracleEvents) {
      const id = `${e.type}::${e.blockNumber}::${e.transactionIndex}::${e.args.cviRoundId}`
      this.oldEventsIds.add(id)
    }
    console.log(
      `${new Date().toISOString()} - fetched all ${
        allCviOracleEvents.length
      } cvi-oracle events from cache and cvi-oracle (${end().toFixed(2)}s)`,
    )
    return allCviOracleEvents
  }

  public async getBaseEvents() {
    const events = await this.getOldCviIndexEvents()
    return events.flat().sort((e1, e2) => e2.blockNumber - e1.blockNumber)
  }
}
