import type { IlLpTokensInfoOfAccountAddressDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/il-backend-swagger-client'
import type {
  Block,
  ProtectionInfo,
  State,
  PeriodSeconds,
  ArmadilloSupportedPair,
  UserStaking,
  PositionOfAddress,
  VaultTransaction,
  PendingRequestTableType,
  EmbedDiscountName,
  PlatformStaking,
} from '@coti-cvi/lw-sdk'
import { cviTradingCompetitionDates } from '@coti-cvi/lw-sdk'
import { WebSite, ChainId, Stator } from '@coti-cvi/lw-sdk'
import type { PayloadAction } from '@reduxjs/toolkit'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import type {
  CviOracleLatestDto,
  MinimalCviOracleEventDto,
} from 'auto-generated-code/src/backend-client-apis/cvi-oracle-events-backend-swagger-client'

import type { IlBackendClientApi } from '../../../auto-generated-code/src'
import type {
  mintBurnModalState as MintBurnModalState,
  StakeUnstaleModalState,
  UnstakeLockType,
  WithdrawLockType,
} from '../types/common.types'

type CollateralPercetage = number
type FeePercetage = number

export type LeaderboardType = {
  traderAddress: string
  pnlUsdc: number
  maxTradeUsdc: number
  trades: number
  score: number
  tvCvix1BalanceInUsdc: number
}

export const timeRanges = {
  select_Competition: { name: 'select' },
  one_day: { name: '24h', Milisecond: 86400000 - 7200000 },
  two_day: { name: '2d', Milisecond: 172800000 - 7200000 },
  one_week: { name: '1w', Milisecond: 604800000 - 7200000 },
  all_time: { name: 'all', Milisecond: 0 },
} as const

export type CviTradingCompetitionRanegs = typeof timeRanges[keyof typeof timeRanges]['name']

export type ReduxState = {
  currentCvi: State<CviOracleLatestDto>

  cviDataLastWeek: MinimalCviOracleEventDto
  cviDataLast24h: MinimalCviOracleEventDto

  themeWeb: WebSite
  isCurrentIpApproved: boolean
  showRestrictModal: boolean
  showCviIntroModal: boolean
  connectWalletModal: { modalIsOpen: boolean }
  cvi: {
    tradingCompetition: {
      chooseTimestamps: { fromTimestamp?: number; toTimestamp?: number }
      leaderBoardData?: Array<LeaderboardType>
    }
    liveTrading: {
      range?: CviTradingCompetitionRanegs
      chooseTimestamps: { fromTimestamp?: number; toTimestamp?: number }
      leaderBoardData?: Array<LeaderboardType>
    }
    historyCompetition: {
      chooseTimestamps: { fromTimestamp?: number; toTimestamp?: number }
      leaderBoardData?: Array<LeaderboardType>
    }
    tv: {
      tvUtilizationPercentage: State<number>
      maxCapacityUsdc: State<number>
      tvlUsdc: State<number>
      positionOfAddress: State<PositionOfAddress>
      vaultTransactions: State<VaultTransaction[]>
      collateralRatio: State<number>
      withdrawLock: State<WithdrawLockType>
      pnl: State<{ pnl: number; percent: number }>
      apr: State<number>
    }
    stack: {
      staking: State<UserStaking>
      platformStaking: State<PlatformStaking>
      unstakeLock: State<UnstakeLockType>
    }
    volatilityToken: {
      platformUsdc: State<number>
      dexPrice: State<number>
      dailyFundingFee: State<number>
      collateralRatio: State<number>
      fundingFeeValues: Record<CollateralPercetage, State<FeePercetage[]> | undefined>
      PendingRequestTable: State<PendingRequestTableType>
      burnBalance: State<number>
      Balance: State<number>
      balancesTableLength: State<number>
      maxMintAmount: State<number>
      newHistoryRowCounter: number
    }
  }
  armadillo: {
    isEmbedDiscountFeatureEnabled: boolean
    embedDiscountInfo?: { discountTypeId: number; discountTypeName: EmbedDiscountName; isUsed: boolean }
    nftModal: { modalIsOpen: boolean }
  }
  walletProtections: State<ProtectionInfo[]>
  accumulatedTvpUsdc: State<number>
  tvpUsdc: State<number>
  stakeUnstakeModal: StakeUnstaleModalState
  mintBurnModal: MintBurnModalState
  latestBlock: State<Block>
  showSlippageNoticeModal: boolean
  providerAddress?: string
  impersolatedAddress?: string
  periodsSeconds: State<PeriodSeconds[]>
  availablePairSelectedProtection: {
    modalIsOpen: boolean
    pair?: ArmadilloSupportedPair
  }
  liquiditiesFromZapper: State<IlLpTokensInfoOfAccountAddressDto>
  pairsWorstIl: State<IlBackendClientApi.WorstIlOfTokenByCoinGekoDto[]>
}
export const DEFAULT_IL_CHAIN_ID = ChainId.PolygonMainnet

export const DEFAULT_TV_CHAIN_ID = ChainId.ArbitrumMainnet

export function loadWebsite(): WebSite {
  if (location.hostname.toLowerCase().includes('theta'.toLowerCase())) {
    return WebSite.Cvi
  }
  if (location.hostname.toLowerCase().includes('armadillo'.toLowerCase())) {
    return WebSite.Armadillo
  }

  const loadWebsiteOnStart = Object.values(WebSite).find(website => website === process.env.INIT_WEBSITE)

  if (loadWebsiteOnStart) {
    return loadWebsiteOnStart
  }

  return WebSite.Armadillo
}

const initialState: ReduxState = {
  ...(loadWebsite() === WebSite.Cvi
    ? {
        chainId: DEFAULT_TV_CHAIN_ID,
        themeWeb: WebSite.Cvi,
      }
    : {
        chainId: DEFAULT_IL_CHAIN_ID,
        themeWeb: WebSite.Armadillo,
      }),
  currentCvi: Stator.pending(),

  cviDataLastWeek: {
    events: [],
    lastBlockTimestamp: 1,
  },
  cviDataLast24h: {
    events: [],
    lastBlockTimestamp: 1,
  },

  showRestrictModal: false,
  showCviIntroModal: false,
  isCurrentIpApproved: false,
  connectWalletModal: { modalIsOpen: false },
  cvi: {
    tradingCompetition: {
      chooseTimestamps: cviTradingCompetitionDates.currentCompetition,
      leaderBoardData: undefined,
    },
    liveTrading: {
      range: 'all',
      chooseTimestamps: cviTradingCompetitionDates.customRange,
      leaderBoardData: undefined,
    },
    historyCompetition: {
      chooseTimestamps: { fromTimestamp: 0, toTimestamp: 0 },
      leaderBoardData: undefined,
    },
    tv: {
      tvUtilizationPercentage: Stator.pending(),
      maxCapacityUsdc: Stator.pending(),
      tvlUsdc: Stator.pending(),
      positionOfAddress: Stator.pending(),
      vaultTransactions: Stator.pending(),
      collateralRatio: Stator.pending(),
      withdrawLock: Stator.pending(
        Stator.resolve<WithdrawLockType>({ isLocked: true, lockEndTimestamp: 0, timeLeftSeconds: 0 }),
      ),
      pnl: Stator.pending(),
      apr: Stator.pending(),
    },
    stack: {
      staking: Stator.resolve({
        currentStake: Stator.pending(),
        availableToStake: Stator.pending(),
      }),
      platformStaking: Stator.pending(),
      unstakeLock: Stator.pending(
        Stator.resolve<UnstakeLockType>({ isLocked: true, lockEndTimestamp: 0, timeLeftSeconds: 0 }),
      ),
    },
    volatilityToken: {
      platformUsdc: Stator.pending(),
      dexPrice: Stator.pending(),
      dailyFundingFee: Stator.pending(),
      collateralRatio: Stator.pending(),
      fundingFeeValues: Stator.pending(),
      PendingRequestTable: Stator.pending(),
      burnBalance: Stator.pending(),
      Balance: Stator.pending(),
      balancesTableLength: Stator.pending(),
      maxMintAmount: Stator.pending(),
      newHistoryRowCounter: 0,
    },
  },
  armadillo: {
    isEmbedDiscountFeatureEnabled: false,
    embedDiscountInfo: undefined,
    nftModal: { modalIsOpen: false },
  },
  walletProtections: Stator.pending(),
  accumulatedTvpUsdc: Stator.pending(),
  liquiditiesFromZapper: Stator.pending(),
  pairsWorstIl: Stator.pending(),
  tvpUsdc: Stator.pending(),
  stakeUnstakeModal: {
    modalIsOpen: false,
    title: 'stake',
  },
  mintBurnModal: {
    modalIsOpen: false,
    title: 'mint',
    id: undefined,
  },
  latestBlock: Stator.pending(),
  showSlippageNoticeModal: false,
  periodsSeconds: Stator.pending(),
  availablePairSelectedProtection: {
    modalIsOpen: false,
    pair: undefined,
  },
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setCurrentCvi: (state, action: PayloadAction<State<CviOracleLatestDto>>) => {
      state.currentCvi = action.payload
    },

    setCviDataLastWeek: (state, action: PayloadAction<MinimalCviOracleEventDto>) => {
      state.cviDataLastWeek = action.payload
    },
    setCviDataLast24h: (state, action: PayloadAction<MinimalCviOracleEventDto>) => {
      state.cviDataLast24h = action.payload
    },

    setLeaderBoardData: (state, action: PayloadAction<Array<LeaderboardType> | undefined>) => {
      state.cvi.tradingCompetition.leaderBoardData = action.payload
    },
    setLiveTrading: (state, action: PayloadAction<Array<LeaderboardType> | undefined>) => {
      state.cvi.liveTrading.leaderBoardData = action.payload
    },
    setCviTradingCompetitionRanegs: (state, action: PayloadAction<CviTradingCompetitionRanegs | undefined>) => {
      state.cvi.liveTrading.range = action.payload
    },
    setCviTradingCompetitionChooseTimestamps: (
      state,
      action: PayloadAction<{ fromTimestamp?: number; toTimestamp?: number }>,
    ) => {
      state.cvi.liveTrading.chooseTimestamps = action.payload
    },
    setHistoryCompetition: (state, action: PayloadAction<Array<LeaderboardType> | undefined>) => {
      state.cvi.historyCompetition.leaderBoardData = action.payload
    },
    setHistoryCompetitionChooseTimestamps: (
      state,
      action: PayloadAction<{ fromTimestamp?: number; toTimestamp?: number }>,
    ) => {
      state.cvi.historyCompetition.chooseTimestamps = action.payload
    },
    setIsCurrentIpApprovedInCvi: (state, action: PayloadAction<boolean>) => {
      state.isCurrentIpApproved = action.payload
    },
    setIsEmbedDiscountFeatureEnabled: (state, action: PayloadAction<boolean>) => {
      state.armadillo.isEmbedDiscountFeatureEnabled = action.payload
    },
    setPositionOfAddress: (state, action: PayloadAction<State<PositionOfAddress>>) => {
      state.cvi.tv.positionOfAddress = action.payload
    },
    setPairsWorstIl: (state, action: PayloadAction<State<IlBackendClientApi.WorstIlOfTokenByCoinGekoDto[]>>) => {
      state.pairsWorstIl = action.payload
    },
    setLiquiditiesFromZapper: (state, action: PayloadAction<State<IlLpTokensInfoOfAccountAddressDto>>) => {
      state.liquiditiesFromZapper = action.payload
    },
    setTvMaxCapacityUsdc: (state, action: PayloadAction<State<number>>) => {
      state.cvi.tv.maxCapacityUsdc = action.payload
    },
    setTvTvlUsdc: (state, action: PayloadAction<State<number>>) => {
      state.cvi.tv.tvlUsdc = action.payload
    },
    setTvCollateralRatio: (state, action: PayloadAction<State<number>>) => {
      state.cvi.tv.collateralRatio = action.payload
    },
    setTvVaultTransactions: (state, action: PayloadAction<ReduxState['cvi']['tv']['vaultTransactions']>) => {
      state.cvi.tv.vaultTransactions = action.payload
    },
    setShowRestrictModal: (state, action: PayloadAction<boolean>) => {
      state.showRestrictModal = action.payload
    },
    setShowCviIntroModal: (state, action: PayloadAction<boolean>) => {
      state.showCviIntroModal = action.payload
    },
    setBalancesTableLength: (state, action: PayloadAction<State<number>>) => {
      state.cvi.volatilityToken.balancesTableLength = action.payload
    },
    setAvailablePairSelectedProtection: (
      state,
      action: PayloadAction<{
        modalIsOpen: boolean
        pair?: ArmadilloSupportedPair
      }>,
    ) => {
      state.availablePairSelectedProtection = action.payload
    },
    setEmbedDiscountInfo: (
      state,
      action: PayloadAction<{ discountTypeId: number; discountTypeName: EmbedDiscountName; isUsed: boolean }>,
    ) => {
      state.armadillo.embedDiscountInfo = action.payload
    },
    setNftModal: (
      state,
      action: PayloadAction<{
        modalIsOpen: boolean
      }>,
    ) => {
      state.armadillo.nftModal = action.payload
    },
    setPeriodsSeconds: (state, action: PayloadAction<State<PeriodSeconds[]>>) => {
      state.periodsSeconds = action.payload
    },
    setConnectWalletModal: (state, action: PayloadAction<{ modalIsOpen: boolean }>) => {
      state.connectWalletModal = action.payload
    },
    setProviderAddress: (state, action: PayloadAction<string | undefined>) => {
      state.providerAddress = action.payload
      state.walletProtections = Stator.pending()
      state.liquiditiesFromZapper = Stator.pending()
    },
    enterImpersolatedAddress: (state, action: PayloadAction<string>) => {
      if (!action.payload) {
        // eslint-disable-next-line no-console
        console.error(`pls use exitImpersolationMode to exit impersolation mode - for readability to other developers`)
      }

      state.impersolatedAddress = action.payload
      state.walletProtections = Stator.pending()
      state.liquiditiesFromZapper = Stator.pending()
    },
    exitImpersolationMode: state => {
      state.impersolatedAddress = undefined
      state.walletProtections = Stator.pending()
      state.liquiditiesFromZapper = Stator.pending()
    },
    setShowSlipageNoticeModal: (state, action: PayloadAction<boolean>) => {
      state.showSlippageNoticeModal = action.payload
    },
    setStakeUnstakeModal: (state, action: PayloadAction<StakeUnstaleModalState>) => {
      state.stakeUnstakeModal = action.payload
    },
    setMintBurnModal: (state, action: PayloadAction<MintBurnModalState>) => {
      state.mintBurnModal = action.payload
    },
    setLatestBlock: (state, action: PayloadAction<State<Block>>) => {
      state.latestBlock = action.payload
    },
    setThemeWebSite: (state, action: PayloadAction<WebSite>) => {
      if (state.themeWeb !== action.payload) {
        state.themeWeb = action.payload
        state.walletProtections = Stator.pending()
        state.liquiditiesFromZapper = Stator.pending()
      }
    },
    setWalletProtections: (state, action: PayloadAction<State<ProtectionInfo[]>>) => {
      state.walletProtections = action.payload
    },
    setAccumulatedTvpUsdc: (state, action: PayloadAction<State<number>>) => {
      state.accumulatedTvpUsdc = action.payload
    },
    setTvpUsdc: (state, action: PayloadAction<State<number>>) => {
      state.tvpUsdc = action.payload
    },
    setStakingData: (state, action: PayloadAction<ReduxState['cvi']['stack']['staking']>) => {
      state.cvi.stack.staking = { ...state.cvi.stack.staking, ...action.payload }
    },
    setPlatformStakingData: (state, action: PayloadAction<ReduxState['cvi']['stack']['platformStaking']>) => {
      state.cvi.stack.platformStaking = { ...state.cvi.stack.platformStaking, ...action.payload }
    },
    setUnstakeLock: (state, action: PayloadAction<State<UnstakeLockType>>) => {
      state.cvi.stack.unstakeLock = action.payload
    },
    setWithrawLock: (state, action: PayloadAction<State<WithdrawLockType>>) => {
      state.cvi.tv.withdrawLock = action.payload
    },
    setPlatformUsdc: (state, action: PayloadAction<State<number>>) => {
      state.cvi.volatilityToken.platformUsdc = action.payload
    },
    setDexPrice: (state, action: PayloadAction<State<number>>) => {
      state.cvi.volatilityToken.dexPrice = action.payload
    },
    setDailyFundingFee: (state, action: PayloadAction<State<number>>) => {
      state.cvi.volatilityToken.dailyFundingFee = action.payload
    },
    setCollateralRatio: (state, action: PayloadAction<State<number>>) => {
      state.cvi.volatilityToken.collateralRatio = action.payload
    },
    setBurnBalance: (state, action: PayloadAction<State<number>>) => {
      state.cvi.volatilityToken.burnBalance = action.payload
    },
    setBalance: (state, action: PayloadAction<State<number>>) => {
      state.cvi.volatilityToken.Balance = action.payload
    },
    setPnl: (state, action: PayloadAction<State<{ pnl: number; percent: number }>>) => {
      state.cvi.tv.pnl = action.payload
    },
    setAPR: (state, action: PayloadAction<State<number>>) => {
      state.cvi.tv.apr = action.payload
    },
    setMaxMintAmount: (state, action: PayloadAction<State<number>>) => {
      state.cvi.volatilityToken.maxMintAmount = action.payload
    },
    seTvUtilizationPercentage: (state, action: PayloadAction<State<number>>) => {
      state.cvi.tv.tvUtilizationPercentage = action.payload
    },
    setFundingFeeValues: (
      state,
      action: PayloadAction<{ collateralPercentage: number; feeByCviValue: State<number[]> }>,
    ) => {
      state.cvi.volatilityToken.fundingFeeValues[action.payload.collateralPercentage] = action.payload.feeByCviValue
    },
    setPendingRequestTable: (state, action: PayloadAction<State<PendingRequestTableType>>) => {
      state.cvi.volatilityToken.PendingRequestTable = action.payload
    },
    setNewHistoryRowCounter: (state, action: PayloadAction<number>) => {
      state.cvi.volatilityToken.newHistoryRowCounter = action.payload
    },
  },
})

export const { actions } = themeSlice

export const store = configureStore({
  reducer: {
    state: themeSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: {
        // Ignore state paths, e.g. state for 'items':
        ignoredPaths: ['beta-cvi-ui/src/components/VolatilityTokensComponents/PendingReqManager/PendingReqManager.tsx'],
      },
      serializableCheck: {
        ignoredPaths: ['beta-cvi-ui/src/components/VolatilityTokensComponents/PendingReqManager/PendingReqManager.tsx'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
