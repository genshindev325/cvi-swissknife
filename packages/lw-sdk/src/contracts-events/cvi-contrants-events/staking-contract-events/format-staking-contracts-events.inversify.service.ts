import { inject, injectable } from 'inversify'
import type { BlockchainEventBase } from '../../types'
import type { TvSupportedChainIds } from '../../../types'
import { tokenDecimals } from '../../../types'
import type { Event } from 'ethers'
import type { FormattedStakingUnstakedEvent, FormattedStakingStakedEvent } from '../../cvi-types'
import { toNumber } from '../../../util'
import type {
  StakedEvent,
  UnstakedEvent,
} from '@coti-cvi/auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/contracts/staking/StakingContracts.sol/StakingV2'
import type { CviContractsInversifyService } from '../../../cvi-contracts'

@injectable()
export class FormatStakingContractsEventsInversifyService {
  constructor(
    @inject('ChainId') public readonly chainId: TvSupportedChainIds,
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
  ) {}

  public formatBaseEvent(e: Event): BlockchainEventBase {
    return {
      blockNumber: e.blockNumber,
      logIndex: e.logIndex,
      transactionHash: e.transactionHash,
      transactionIndex: e.transactionIndex,
    }
  }

  public toFormatStakeEvent = (event: StakedEvent): FormattedStakingStakedEvent => {
    return {
      ...this.formatBaseEvent(event),
      type: 'StakedEvent',
      args: {
        account: event.args.account,
        goviAmount: toNumber(event.args.goviAmount, tokenDecimals.GOVI),
        xGOVIMinted: toNumber(event.args.xGOVIMinted, tokenDecimals.GOVI),
        xGOVIBalance: toNumber(event.args.xGOVIBalance, tokenDecimals.GOVI),
      },
    }
  }

  public toFormatUnstakeEvent = (event: UnstakedEvent): FormattedStakingUnstakedEvent => {
    return {
      ...this.formatBaseEvent(event),
      type: 'UnstakedEvent',
      args: {
        account: event.args.account,
        xGOVIBurned: toNumber(event.args.xGOVIBurned, tokenDecimals.GOVI),
        goviReward: toNumber(event.args.goviReward, tokenDecimals.GOVI),
        xGOVIBalance: toNumber(event.args.xGOVIBalance, tokenDecimals.GOVI),
      },
    }
  }
}
