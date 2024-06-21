import { inject, injectable } from 'inversify'
import type { FormattedStakingStakedEvent, FormattedStakingUnstakedEvent } from '../../contracts-events/cvi-types'
import type { GlobalEventsInversifyService } from '../../global-events.inversify.service'
import type { StakingInversifyService } from '../../staking'

@injectable()
export class CviAdminApiStakingInversifyService {
  public data: (FormattedStakingStakedEvent | FormattedStakingUnstakedEvent)[] = []

  constructor(
    @inject('GlobalEventsInversifyService') private readonly globalEventsInversifyService: GlobalEventsInversifyService,
    @inject('StakingInversifyService') private readonly stakingInversifyService: StakingInversifyService,
  ) {}
}
