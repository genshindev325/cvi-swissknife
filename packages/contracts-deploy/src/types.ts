import type { ChainId } from '../../lw-sdk/src/types/config-types'
import type { AppEnv } from '@coti-cvi/common-be'
import type { MainnetWhale } from '../../lw-sdk/src/contracts-deploy-utils/types'

export type EnvConfig = {
  appEnv: AppEnv
  isStartingHardhatNode: boolean
  repoPath: string
  deploymentsFileServerPort: number
  chainId: ChainId
  mainnetWhales: MainnetWhale[]
}
