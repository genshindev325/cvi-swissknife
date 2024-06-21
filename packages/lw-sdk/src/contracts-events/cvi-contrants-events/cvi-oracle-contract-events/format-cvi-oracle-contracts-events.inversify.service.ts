import { inject, injectable } from 'inversify'
import type { CVISupportedChainIds } from '../../../types'
import { REDIS_INVALIDATION_KEY_BY_CHAIN_ID } from '../../../types'
import type { Event } from 'ethers'
import type { BlockchainContractEventsCacheUtils } from '../cvi-oracle-events-cache-utils.inversify.service'
import type { AnswerUpdatedEvent } from 'auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/contracts/oracle/CVIFeedOracleContracts.sol/CVIDeviationOracle'
import type { FormattedCviOracleAnswerUpdateEvent } from '../../cvi-oracle-types'
import type { CVIOracleInversifyService } from '@coti-cvi/lw-sdk'
import { toNumber } from '@coti-cvi/lw-sdk'

@injectable()
export class FormatCviOracleContractsEventsInversifyService {
  constructor(
    @inject('ChainId') public readonly chainId: CVISupportedChainIds,
    @inject('BlockchainContractEventsCacheUtils')
    private readonly blockchainContractEventsCacheUtils: BlockchainContractEventsCacheUtils,
    @inject('CVIOracleInversifyService') private readonly cviOracleInversifyService: CVIOracleInversifyService,
  ) {}

  public toFormatEvent(event: Event) {
    return {
      ...this.blockchainContractEventsCacheUtils.formatBaseEvent(event),
      args: event.args,
    }
  }

  public async toFormattedCviIndexEvent(e: AnswerUpdatedEvent): Promise<FormattedCviOracleAnswerUpdateEvent> {
    const base = this.blockchainContractEventsCacheUtils.formatBaseEvent(e)

    const result: FormattedCviOracleAnswerUpdateEvent = {
      ...base,
      type: 'AnswerUpdateEvent',
      blockTimestamp: e.args.updatedAt.toNumber(),
      args: {
        cviIndex: toNumber(e.args.current, this.cviOracleInversifyService.oracleDecimals),
        cviRoundId: e.args.roundId.toNumber(),
      },
    }

    await this.blockchainContractEventsCacheUtils.saveCviOracleEvent(
      REDIS_INVALIDATION_KEY_BY_CHAIN_ID[this.chainId]['cvi-oracle-events-group'],
      result,
    )

    return result
  }
}
