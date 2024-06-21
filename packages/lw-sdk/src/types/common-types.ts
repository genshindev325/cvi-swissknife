import type { BlockchainName } from './config-types'
import type { ProtectionId, Protections } from './il-common-types'
import type { ArmadilloSupportedTokenName, TokenName } from './token-types'
import type { State } from '../state'
import type { CustomError } from '../custom-error'
import type { BigNumber } from 'ethers'
import type { iNotification } from 'react-notifications-component'
import type { ExpectedLPTokensValueGrowthChangedEvent } from '../../../auto-generated-code/src/git-contract-types/packages/contracts-deploy/artifacts/@coti-cvi/contracts-il/contracts/ILProtectionConfig'
import type { ILProtectionInversifyService } from '../il-protection.inversify.service'
import type { DuePayoutPoint, ProtectionInfo } from './il-admin-panel-types'
import type { Block } from './block-types'
import type { IlBackendClientApi } from '../../../auto-generated-code/src'
import type { PositionOfAddress } from '../theta-vault'
import type { UserStaking, StakingInversifyService, PlatformStaking } from '../staking'
import type { VaultTransaction } from '.'
import type {
  CompletedBurnVolTokenEvent,
  CompletedMintVolTokenEvent,
  FailedVolTokenEvent,
  PendingVolTokenEvent,
  VolTokenEvent,
} from './vol-token-common-types'
import type {
  FormattedProtectionBoughtEvent,
  FormattedProtectionClosedEvent,
  FormattedLiquidityAddedEvent,
  FormattedLiquidityWithdrawnEvent,
  FormattedVtSubmitRequestEvent,
  FormattedVtFulfillRequestEvent,
  FormattedVtLiquidateRequestEvent,
  FormattedVtMintEvent,
  FormattedProtectionMintDiscountDetailsEvent,
  FormattedVtBurnEvent,
  GroupFormattedVolatilityTokensEvents,
} from '../contracts-events'

export const SERVICE_NAMES = [
  'data-feed',
  'il-backend',
  'il-monitor',
  'cvi-monitor',
  'cvi-backend',
  'cvi-tweet',
  'cvi-oracle-events-backend',
  'chatgpt-server-wrapper',
] as const // package.json name

export type PackageName = 'beta-cvi-ui' | typeof SERVICE_NAMES[number]

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export type HardhatPodStarted = {
  BlockchainName: BlockchainName
  dateUtc: string
}

export type ITokenName = {
  readonly TokenName: TokenName
}
export type IArmadilloSupportedTokenName = {
  readonly ArmadilloSupportedTokenName: ArmadilloSupportedTokenName
}

export type RequestStatus = 'pending' | 'rejected' | 'resolved'

type DataPropertyNames<T, E> = {
  [K in keyof T]: T[K] extends E ? K : never
}[keyof T]

export type DataPropertiesOnly<T, E> = {
  [P in DataPropertyNames<T, E>]: T[P] extends object ? DataPropertiesOnly<T[P], Function> : T[P]
}

export enum LOCAL_STORAGE_KEYS {
  FULL_MODE = 'FULL_MODE',
}

export enum MODE {
  ON = 'on',
  OFF = 'off',
}

export interface ContractData {
  address: string
  abi: unknown[]
  transactionHash: string
  creationBlock: number
  receipt?: {
    to?: null
    from?: string
    contractAddress?: string
    transactionIndex?: number
    gasUsed?: string
    logsBloom?: string
    blockHash?: string
    transactionHash?: string
    logs?: {
      transactionIndex: number
      blockNumber: number
      transactionHash: string
      address: string
      topics: string[]
      data: string
      logIndex: number
      blockHash: string
    }[]
    blockNumber: number
    cumulativeGasUsed?: string
    status?: number
    byzantium?: boolean
  }
  numDeployments?: number
  history?: { blockNumber: number; address: string; abi?: unknown[] }[]
}

export interface Contracts {
  [contractName: string]: ContractData
}

export type Override<T1, T2> = {
  [K in Exclude<keyof T1, keyof T2>]: T1[K]
} & {
  [K in keyof T2]: T2[K]
}

export type S3Info = {
  bucket: string
  region: string
  accessKeyId: string
  secretAccessKey: string
}

export type RedisInfo = {
  host: string
  port: number
  username?: string
  password?: string
}

export type Point = [x: number, y: number]

export enum WebSite {
  Cvi = 'CVI',
  Armadillo = 'ARMADILLO',
}

type InversifyAllIlMethodsName = keyof DataPropertiesOnly<ILProtectionInversifyService, Function>
type InversifyAllStakingMethodsName = keyof DataPropertiesOnly<StakingInversifyService, Function>
export type InversifyAllMethodsName = InversifyAllIlMethodsName | InversifyAllStakingMethodsName

export type GlobalEventsWithAddress = {
  errorWithAddress: (address: string, error: Error | CustomError) => void
  tvPositionOfAddress: (address: string, state: State<PositionOfAddress>) => void
  tvPnl: (address: string, state: State<{ pnl: number; percent: number }>) => void
  tvTransactionsOfAddress: (address: string, state: State<VaultTransaction[]>) => void

  stakeStakingInfo: (address: string, state: State<UserStaking>) => void
  stakeUnstakeLockWithAddress: (
    address: string,
    state: State<{ isLocked: boolean; lockEndTimestamp: number; timeLeftSeconds: number }>,
  ) => void
  tvWithdrawLockWithAddress: (
    address: string,
    state: State<{ isLocked: boolean; lockEndTimestamp: number; timeLeftSeconds: number }>,
  ) => void
}
export type VtGlobalEventsWithAddress = {
  errorWithAddress: (address: string, error: Error | CustomError) => void
  vtPendingRequestTableWithAddress: (address: string, state: State<PendingRequestTableType>) => void
  vtBurnBalance: (address: string, state: State<number>) => void
  vtBalance: (address: string, state: State<number>) => void
}

export type GlobalEvents = {
  armadilloEligibleDiscount: (payload: { source: 'bancor'; addresses: string[] }) => void
  ilPairsWorstIl: (state: State<IlBackendClientApi.WorstIlOfTokenByCoinGekoDto[]>) => void
  ilLiquiditiesFromZapper: (state: State<IlBackendClientApi.IlLpTokensInfoOfAccountAddressDto>) => void
  errors: (error: Error | CustomError) => void
  latestBlock: (state: State<Block>) => void
  ilProtections: (state: State<Protections>) => void
  ilTvpUsdc: (state: State<number>) => void
  ilAccumulatedTvpUsdc: (state: State<number>) => void
  ilLeftTvpUsdcAvailable: (state: State<BigNumber>) => void
  ilWalletProtections: (options: { address: string; protections: Map<ProtectionId, ProtectionInfo> }) => void
  messages: (message: {
    id: InversifyAllMethodsName
    type: iNotification['type']
    title?: iNotification['title']
    message: iNotification['message']
  }) => void
  ilContractNewEventProtectionMintDiscountDetailsEvent: (payload: FormattedProtectionMintDiscountDetailsEvent) => void
  ilNewContractEventProtectionsBought: (payload: FormattedProtectionBoughtEvent) => void
  ilNewContractEventProtectionClosed: (payload: FormattedProtectionClosedEvent) => void
  ilnNewContractEventPremiumGrowthChanged: (payload: ExpectedLPTokensValueGrowthChangedEvent) => void
  ilNewLiquidityAddedEvents: (payload: FormattedLiquidityAddedEvent) => void
  ilNewLiquidityWithdrawnEvents: (payload: FormattedLiquidityWithdrawnEvent) => void
  ilAllDuePayoutsByProtectionId: (payload: Map<ProtectionId, DuePayoutPoint[]>) => void
  stakePlatformStakingInfo: (state: State<PlatformStaking>) => void
}

export type TVaultGlobalEvents = {
  tvTvlUsdc: (state: State<number>) => void
  tvAPR: (state: State<number>) => void
  tvCollateralRatio: (state: State<number>) => void
  tvMaxCapacityUsdc: (state: State<number>) => void
  tvUtilizationPercentage: (state: State<number>) => void
}
export type VolatilityTGlobalEvents = {
  vtMaxMintAmount: (state: State<number>) => void
  vtPlatformUsdc: (state: State<number>) => void
  vtDexPrice: (state: State<number>) => void
  vtDailyFundingFee: (state: State<number>) => void
  vtCollateralRatio: (state: State<number>) => void
  vtFundingFeeValues: (collateralPercentage: number, feePercentages: State<number[]>) => void
  vtFundingFeeTable: (state: State<PendingRequestTableType>) => void
  vtPendingRequest: (pendingEvent: PendingVolTokenEvent, state: State<PendingVolTokenEvent[]>) => void
  vtPreMint: (
    preMintDetails: State<{
      netMintAmount: number
      expectedVolTokensAmount: number
      openPositionFee: number
      buyingPremiumFee: number
      timeWindowFee: number
      keepersFee: number
    }>,
  ) => void
}

export type PendingRequestTableType = {
  pendingRequests: PendingVolTokenEvent[]
  submitEvents: FormattedVtSubmitRequestEvent[]
  tableRowEvents: PendingFeeTableRowType[]

  completedTableRowEvents: ((CompletedMintVolTokenEvent | CompletedBurnVolTokenEvent | FailedVolTokenEvent) & {
    net: number
  })[]
  fulfillEvents: FormattedVtFulfillRequestEvent[]
  liquidateEvents: FormattedVtLiquidateRequestEvent[]
  mintEvents: FormattedVtMintEvent[]
  burnEvents: FormattedVtBurnEvent[]
  allEvents: GroupFormattedVolatilityTokensEvents[]

  events: VolTokenEvent[]
  completedRequest: (CompletedMintVolTokenEvent | CompletedBurnVolTokenEvent | FailedVolTokenEvent)[]
}

export type PendingFeeTableRowTypeExtraMint = {
  netMintAmount: number
  expectedVolTokensAmount: number
  buyingPremiumFeePercentage: number
  insufficientLiquidity: boolean
  insufficientSlippage: boolean
  openPositionFee: number
  buyingPremiumFee: number
  timePenaltyFee: number
  keepersFee: number
}
export type PendingFeeTableRowTypeExtraBurn = {
  netBurnAmount: number
  expectedUSDCAmount: number
  closeFee: number
  timePenaltyFee: number
  keepersFee: number
}
export type PendingFeeTableRowType =
  | PendingVolTokenEvent &
      (
        | {
            extraMint: PendingFeeTableRowTypeExtraMint
          }
        | {
            extraBurn: PendingFeeTableRowTypeExtraBurn
          }
      )

export type Address = string
