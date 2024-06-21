import { inject, injectable } from 'inversify'
import type { CviContractsInversifyService } from '../../../cvi-contracts'
import type { FormatStakingContractsEventsInversifyService } from './format-staking-contracts-events.inversify.service'

@injectable()
export class StakingContractsEventsInversifyService {
  constructor(
    @inject('CviContractsInversifyService') private readonly cviContractsInversifyService: CviContractsInversifyService,
    @inject('FormatStakingContractsEventsInversifyService')
    private readonly formatStakingContractsEventsInversifyService: FormatStakingContractsEventsInversifyService,
  ) {}

  public getOldStakedEvents(address?: string) {
    return this.cviContractsInversifyService.stakingV2
      .queryFilter(this.cviContractsInversifyService.stakingV2.filters.Staked(address))
      .then(r => Promise.all(r.map(e => this.formatStakingContractsEventsInversifyService.toFormatStakeEvent(e))))
  }

  public getOldUnStakedEvents(address?: string) {
    return this.cviContractsInversifyService.stakingV2
      .queryFilter(this.cviContractsInversifyService.stakingV2.filters.Unstaked(address))
      .then(r => Promise.all(r.map(e => this.formatStakingContractsEventsInversifyService.toFormatUnstakeEvent(e))))
  }
}
