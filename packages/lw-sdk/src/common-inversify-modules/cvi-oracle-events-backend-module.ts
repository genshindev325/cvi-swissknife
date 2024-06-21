import { ContainerModule } from 'inversify'
import { CviOracleAdminApiInversifyService } from '../admin-panels'
import {
  CviOracleContractsEventsInversifyService,
  FormatCviOracleContractsEventsInversifyService,
} from '../contracts-events'

//
export function createCviOracleEventsBackendModule() {
  return new ContainerModule(bind => {
    bind('CviOracleContractsEventsInversifyService').to(CviOracleContractsEventsInversifyService)
    bind('FormatCviOracleContractsEventsInversifyService').to(FormatCviOracleContractsEventsInversifyService)
    bind('CviOracleAdminApiInversifyService').to(CviOracleAdminApiInversifyService)
  })
}
