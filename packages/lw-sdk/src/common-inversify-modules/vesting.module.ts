import { ContainerModule } from 'inversify'
import {
  RewardRouterContractsEventsInversifyService,
  VestingContractsEventsInversifyService,
} from '../contracts-events'
import type { GetContractInversifyService } from '../get-contract.inversify.service'
import { RewardRouterInversifyService, VestingInversifyService } from '../staking-vesting'
import { VestingContractsInversifyService } from '../vesting-contracts'

export function createVestingModule() {
  return new ContainerModule(bind => {
    bind('VestingContractsInversifyService').to(VestingContractsInversifyService)
    bind('RewardRouterInversifyService').to(RewardRouterInversifyService)
    bind('VestingInversifyService').to(VestingInversifyService)
    bind('RewardRouterContractsEventsInversifyService').to(RewardRouterContractsEventsInversifyService)
    bind('VestingContractsEventsInversifyService').to(VestingContractsEventsInversifyService)

    bind('TokenEsGOVI').toDynamicValue(async ({ container }) => {
      const getContractInversifyService = await container.getAsync<GetContractInversifyService>(
        'GetContractInversifyService',
      )
      return getContractInversifyService.getTokenFromContract('EsGOVI')
    })
  })
}
