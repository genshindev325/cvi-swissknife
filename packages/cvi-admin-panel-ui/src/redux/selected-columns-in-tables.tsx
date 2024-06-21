import type {
  TvFulfillDepositEventDto,
  TvFulfillWithdrawEventDto,
  TvLiquidateEventDto,
  TvSubmitEventDto,
  VtBurnEventDto,
  VtFulfillRequestEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
  VtCviTransferEventDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { TokenName } from '@coti-cvi/lw-sdk/src'
import DisplayNumber from '../../../beta-cvi-ui/src/components/DisplayNumber/DisplayNumber'
import { ToAddress } from '../components/to-address'
import type { Flatten } from '../types'
import type { ReduxState } from './types'
import type { StrictOmit } from 'ts-essentials'
import { format } from 'date-fns'

export type AllEvents = {
  VtUniswapSwapEvent: VtUniswapSwapEventDto
  VtCviTransferEvent: VtCviTransferEventDto
  VtSubmitEvent: VtSubmitRequestEventDto
  VtMintEvent: VtMintEventDto
  VtLiquidateEvent: VtLiquidateRequestEventDto
  VtFulfillEvent: VtFulfillRequestEventDto
  VtBurnEvent: VtBurnEventDto
  TvSubmitEvent: TvSubmitEventDto
  TvFulfillDepositEvent: TvFulfillDepositEventDto
  TvFulfillWithdrawEvent: TvFulfillWithdrawEventDto
  TvLiquidateEvent: TvLiquidateEventDto
}

export type TablesColumnObject = {
  VtUniswapSwapEvent: Pick<
    VtUniswapSwapEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<VtUniswapSwapEventDto['args'], 'tokenNameAmountIn' | 'tokenNameAmountOut'>
  VtCviTransferEvent: Pick<
    VtCviTransferEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<VtCviTransferEventDto['args'], 'cviTokenName'>
  VtSubmitEvent: Pick<
    VtSubmitRequestEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<
      VtSubmitRequestEventDto['args'],
      'cviTokenName' | 'requestType' | 'tokenNameAmountPaid' | 'tokenNameSubmitFeesAmount'
    >
  VtMintEvent: Pick<
    VtMintEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<
      VtMintEventDto['args'],
      | 'cviTokenName'
      | 'buyingPremiumFeeTokenName'
      | 'mintedTokenName'
      | 'openPositionFeeTokenName'
      | 'positionedTokenNameAmount'
      | 'action'
    >
  VtLiquidateEvent: Pick<
    VtLiquidateRequestEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<
      VtLiquidateRequestEventDto['args'],
      'cviTokenName' | 'findersFeeAmountTokenName' | 'liquidateTimestampString' | 'action' | 'requestType'
    >
  VtFulfillEvent: Pick<
    VtFulfillRequestEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<VtFulfillRequestEventDto['args'], 'cviTokenName' | 'requestType' | 'tokenNameFulfillFeesAmount'>
  VtBurnEvent: Pick<
    VtBurnEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<
      VtBurnEventDto['args'],
      | 'cviTokenName'
      | 'burnedTokenscviTokenName'
      | 'closingPremiumFeeTokenName'
      | 'tokenNameClosePositionFee'
      | 'action'
    >
  TvSubmitEvent: Pick<
    TvSubmitEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<TvSubmitEventDto['args'], 'tokenAmountInUsdcTokenName' | 'tokenAmountName' | 'requestType'>
  TvFulfillDepositEvent: Pick<
    TvFulfillDepositEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<TvFulfillDepositEventDto['args'], 'tokenName' | 'action'>
  TvFulfillWithdrawEvent: Pick<
    TvFulfillWithdrawEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<TvFulfillWithdrawEventDto['args'], 'tokenName' | 'action'>
  TvLiquidateEvent: Pick<
    TvLiquidateEventDto,
    'blockNumber' | 'blockTimestamp' | 'transactionIndex' | 'logIndex' | 'transactionHash'
  > &
    StrictOmit<TvLiquidateEventDto['args'], 'tokenAmountName' | 'requestType'>
}

type FlattenTables = {
  [Table in keyof TablesColumnObject]: Flatten<TablesColumnObject[Table]>
}

type AllKeys = {
  [Table in keyof TablesColumnObject]: keyof FlattenTables[Table]
}[keyof TablesColumnObject]

export type ValueOf<Key extends AllKeys> = {
  [Table in keyof TablesColumnObject]: Key extends keyof FlattenTables[Table]
    ? { value: FlattenTables[Table][Key]; event: AllEvents[Table]; table: Table }
    : never
}[keyof TablesColumnObject]

export const ALL_TABLE_COLUMNS: {
  [ColumnName in AllKeys]: {
    header: (tableType: ValueOf<ColumnName>['table']) => JSX.Element
    value: (value: ValueOf<ColumnName>) => JSX.Element
  }
} = {
  account: {
    header: tableType => <span>Address</span>,
    value: ({ value, event, table }) => (
      <span>
        <ToAddress address={value} />
      </span>
    ),
  },
  currentThetaVaultUsdcBalance: {
    header: tableType => <span>currentThetaVaultUsdcBalance</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEvent.cviIndex': {
    header: tableType => <span>CVI</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    header: tableType => <span>$CVI</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    header: tableType => <span>$CVI-DEX</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    header: tableType => <span>$TV-CVI</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    header: tableType => <span>dexCviBalanceUsdcByPlatformPrice</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    header: tableType => <span>dexCviBalanceUsdc</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    header: tableType => <span>currentThetaVaultUsdcBalance</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    header: tableType => <span>platformUSDCLiquidity</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    header: tableType => <span>platformVtBalanceUsdcByPlatformPrice</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    header: tableType => <span>dexCviBalance</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    header: tableType => <span>tvCollateralRatio</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    header: tableType => <span>tvPlatformPnl</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  'generalInfoOfEventBySender.usdcBalance': {
    header: tableType => <span>usdcBalance (Sender)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventBySender.vtCviBalance': {
    header: tableType => <span>vtCviBalance (Sender)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={TokenName.CVI} />
      </span>
    ),
  },
  'generalInfoOfEventBySender.vtCvix1BalanceInUsdc': {
    header: tableType => <span>vtCvix1BalanceInUsdc (Sender)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventBySender.vtCvix1BalanceInUsdcInDex': {
    header: tableType => <span>vtCvix1BalanceInUsdcInDex (Sender)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventBySender.tvCvix1Balance': {
    header: tableType => <span>tvCvix1Balance (Sender)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={TokenName.CVI} />
      </span>
    ),
  },
  'generalInfoOfEventBySender.tvCvix1BalanceInUsdc': {
    header: tableType => <span>tvCvix1BalanceInUsdc (Sender)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventByReceiver.usdcBalance': {
    header: tableType => <span>usdcBalance (Receiver)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventByReceiver.vtCviBalance': {
    header: tableType => <span>vtCviBalance (Receiver)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={TokenName.CVI} />
      </span>
    ),
  },
  'generalInfoOfEventByReceiver.vtCvix1BalanceInUsdc': {
    header: tableType => <span>vtCvix1BalanceInUsdc (Receiver)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventByReceiver.vtCvix1BalanceInUsdcInDex': {
    header: tableType => <span>vtCvix1BalanceInUsdcInDex (Receiver)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventByReceiver.tvCvix1Balance': {
    header: tableType => <span>tvCvix1Balance (Receiver)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={TokenName.CVI} />
      </span>
    ),
  },
  'generalInfoOfEventByReceiver.tvCvix1BalanceInUsdc': {
    header: tableType => <span>tvCvix1BalanceInUsdc (Receiver)</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  toAccount: {
    header: tableType => <span>To Address</span>,
    value: ({ value, event, table }) => (
      <span>
        <ToAddress address={value} />
      </span>
    ),
  },
  cviAmount: {
    header: tableType => <span>CVI</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.cviTokenName} />
      </span>
    ),
  },
  requestId: {
    header: tableType => <span>Request ID</span>,
    value: ({ value, event, table }) => <span>{value}</span>,
  },
  action: {
    header: tableType => <span>Type</span>,
    value: ({ value, event, table }) => <span>{value}</span>,
  },
  submitFeesAmount: {
    header: tableType => <span>submitFeesAmount</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.tokenNameSubmitFeesAmount} />
      </span>
    ),
  },
  requestTimestamp: {
    header: tableType => <span>Request Date</span>,
    value: ({ value, event, table }) => <span>{format(new Date(value * 1000), 'dd/MM/yyyy HH:mm:ss')}</span>,
  },
  targetTimestamp: {
    header: tableType => <span>Target Date</span>,
    value: ({ value, event, table }) => <span>{format(new Date(value * 1000), 'dd/MM/yyyy HH:mm:ss')}</span>,
  },
  tokenAmountPaid: {
    header: tableType => <span>tokenAmountPaid</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.tokenNameAmountPaid} />
      </span>
    ),
  },
  useKeepers: {
    header: tableType => <span>Use Keepers?</span>,
    value: ({ value, event, table }) => <span>{value ? 'True' : 'False'}</span>,
  },
  maxBuyingPremiumFeePercentage: {
    header: tableType => <span>maxBuyingPremiumFeePercentage</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} percentage />
      </span>
    ),
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    header: tableType => <span>usdcBalance</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    header: tableType => <span>vtCviBalance</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={TokenName.CVI} />
      </span>
    ),
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    header: tableType => <span>vtCvix1BalanceInUsdc</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    header: tableType => <span>vtCvix1BalanceInUsdcInDex</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    header: tableType => <span>tvCvix1Balance</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={TokenName.CVI} />
      </span>
    ),
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    header: tableType => <span>tvCvix1BalanceInUsdc</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  positionedTokenAmount: {
    header: tableType => <span>positionedTokenAmount</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.positionedTokenNameAmount} />
      </span>
    ),
  },
  mintedTokens: {
    header: tableType => <span>Minted</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.mintedTokenName} />
      </span>
    ),
  },
  openPositionFee: {
    header: tableType => <span>Open Position Fee</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.openPositionFeeTokenName} />
      </span>
    ),
  },
  buyingPremiumFee: {
    header: tableType => <span>Buying Premium Fee</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.buyingPremiumFeeTokenName} />
      </span>
    ),
  },
  liquidator: {
    header: tableType => <span>Liquidator</span>,
    value: ({ value, event, table }) => (
      <span>
        <ToAddress address={value} />
      </span>
    ),
  },
  findersFeeAmount: {
    header: tableType => <span>Finders Fee</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.findersFeeAmountTokenName} />
      </span>
    ),
  },
  liquidateTimestamp: {
    header: tableType => <span>Liquidation Date</span>,
    value: ({ value, event, table }) => <span>{format(new Date(value * 1000), 'dd/MM/yyyy HH:mm:ss')}</span>,
  },
  fulfillFeesAmount: {
    header: tableType => <span>fulfillFeesAmount</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.tokenNameFulfillFeesAmount} />
      </span>
    ),
  },
  isAborted: {
    header: tableType => <span>isAborted</span>,
    value: ({ value, event, table }) => <span>{value}</span>,
  },
  keepersCalled: {
    header: tableType => <span>keepersCalled</span>,
    value: ({ value, event, table }) => <span>{value ? 'True' : 'False'}</span>,
  },
  fulfiller: {
    header: tableType => <span>fulfiller</span>,
    value: ({ value, event, table }) => (
      <span>
        <ToAddress address={value} />
      </span>
    ),
  },
  fulfillTimestamp: {
    header: tableType => <span>fulfillTimestamp</span>,
    value: ({ value, event, table }) => <span>{value}</span>,
  },
  burnedTokensCvi: {
    header: tableType => <span>burnedTokensCvi</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.burnedTokenscviTokenName} />
      </span>
    ),
  },
  closePositionFee: {
    header: tableType => <span>closePositionFee</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.tokenNameClosePositionFee} />
      </span>
    ),
  },
  closingPremiumFee: {
    header: tableType => <span>closingPremiumFee</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.closingPremiumFeeTokenName} />
      </span>
    ),
  },
  tokenAmount: {
    header: tableType => <span>tokenAmount</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.tokenAmountName} />
      </span>
    ),
  },
  tokenAmountInUsdc: {
    header: tableType => <span>tokenAmountInUsdc</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  totalSupply: {
    header: tableType => <span>Total Supply</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  submitRequestTokenAmountUsdc: {
    header: tableType => <span>submitRequestTokenAmountUsdc</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  usdcAmountReceived: {
    header: tableType => <span>usdcAmountReceived</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  platformLiquidityAmountUsdc: {
    header: tableType => <span>$Platform Liquidity</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  dexVolTokenUSDCAmount: {
    header: tableType => <span>dexVolTokenUSDCAmount</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  dexVolTokenAmount: {
    header: tableType => <span>dexVolTokenAmount</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  dexUSDCAmount: {
    header: tableType => <span>dexUSDCAmount</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} dollar />
      </span>
    ),
  },
  mintedThetaTokens: {
    header: tableType => <span>mintedThetaTokens</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  dexUSDCviTokenAmount: {
    header: tableType => <span>dexUSDCviTokenAmount</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  burnedThetaTokens: {
    header: tableType => <span>burnedThetaTokens</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  blockNumber: {
    header: tableType => <span>blockNumber</span>,
    value: ({ value, event, table }) => <span>{value}</span>,
  },
  blockTimestamp: {
    header: tableType => <span>blockTimestamp</span>,
    value: ({ value, event, table }) => <span>{format(new Date(value * 1000), 'dd/MM/yyyy HH:mm:ss')}</span>,
  },
  tokenAmountIn: {
    header: tableType => <span>Tokens In</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.tokenNameAmountIn} />
      </span>
    ),
  },
  tokenAmountOut: {
    header: tableType => <span>Tokens Out</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} tokenName={event.args.tokenNameAmountOut} />
      </span>
    ),
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    header: tableType => <span>tvUtilizationPercentage</span>,
    value: ({ value, event, table }) => (
      <span>
        <DisplayNumber state={value} />
      </span>
    ),
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    header: tableType => <span>usdcBalance (-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} dollar />,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    header: tableType => <span>vtCviBalance (-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} tokenName={TokenName.CVI} />,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    header: tableType => <span>vtCvix1BalanceInUsdc (-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} dollar />,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    header: tableType => <span>vtCvix1BalanceInUsdcInDex (-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} dollar />,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    header: tableType => <span>tvCvix1Balance (-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} tokenName={TokenName.T_CVI_LP} />,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    header: tableType => <span>tvCvix1BalanceInUsdc (-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} dollar />,
  },
  fromAccount: {
    header: tableType => <span>From Address</span>,
    value: ({ value, event, table }) => (
      <span>
        <ToAddress address={value} />
      </span>
    ),
  },
  transactionIndex: {
    header: tableType => <span>Transaction Index</span>,
    value: ({ value, event, table }) => <span>{value}</span>,
  },
  logIndex: {
    header: tableType => <span>Log Index</span>,
    value: ({ value, event, table }) => <span>{value}</span>,
  },
  transactionHash: {
    header: tableType => <span>Transaction Hash</span>,
    value: ({ value, event, table }) => (
      <a href={`https://arbiscan.io/tx/${event.transactionHash}`} target="_blank" rel="noopener noreferrer">
        {value.slice(0, 6)}
      </a>
    ),
  },
  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    header: tableType => <span>tvLockedUsdc</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} dollar />,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    header: tableType => <span>tvLockedPercentageOfTvCurrentBalance</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  usdcPaidAfterTimeDelayFee: {
    header: tableType => <span>usdcPaidAfterTimeDelayFee</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} tokenName={TokenName.USDC} />,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    header: tableType => <span>tvAprByLast30Days</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    header: tableType => <span>tvAprByLast30Days(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    header: tableType => <span>cviIndex(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    header: tableType => <span>vtCviPriceInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    header: tableType => <span>vtCviPriceDexInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    header: tableType => <span>tvCvix1PriceInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.currentThetaVaultUsdcBalance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.tvLockedUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.tvLockedPercentageOfTvCurrentBalance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.dexCviBalanceUsdcByPlatformPrice(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.dexCviBalanceUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.platformUSDCLiquidity(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.platformVtBalanceUsdcByPlatformPrice(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.dexCviBalance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.tvCollateralRatio(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.tvUtilizationPercentage(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    header: tableType => <span>generalInfoOfEventOneBlockBefore.tvPlatformPnl(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.usdcBalance': {
    header: tableType => <span>usdcBalance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCviBalance': {
    header: tableType => <span>vtCviBalance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCvix1BalanceInUsdc': {
    header: tableType => <span>vtCvix1BalanceInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    header: tableType => <span>vtCvix1BalanceInUsdcInDex(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.tvCvix1Balance': {
    header: tableType => <span>tvCvix1Balance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.tvCvix1BalanceInUsdc': {
    header: tableType => <span>tvCvix1BalanceInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.usdcBalance': {
    header: tableType => <span>usdcBalance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCviBalance': {
    header: tableType => <span>vtCviBalance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCvix1BalanceInUsdc': {
    header: tableType => <span>vtCvix1BalanceInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    header: tableType => <span>vtCvix1BalanceInUsdcInDex(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.tvCvix1Balance': {
    header: tableType => <span>tvCvix1Balance(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.tvCvix1BalanceInUsdc': {
    header: tableType => <span>tvCvix1BalanceInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  /////////////
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    header: tableType => <span>vtCviUsdcLpTokensInCvi</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    header: tableType => <span>vtCviUsdcLpTokensInUsdc</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    header: tableType => <span>vtCviUsdcLpTokens</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    header: tableType => <span>vtCviUsdcLpTokensInCvi(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    header: tableType => <span>vtCviUsdcLpTokensInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    header: tableType => <span>vtCviUsdcLpTokens(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    header: tableType => <span>totalSupplyOfCviUsdcLpTokens</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    header: tableType => <span>vtCviUsdcLpTokenWorthInUsdc</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    header: tableType => <span>totalSupplyOfCviUsdcLpTokens(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    header: tableType => <span>vtCviUsdcLpTokenWorthInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySender.vtCviUsdcLpTokensInCvi': {
    header: tableType => <span>vtCviUsdcLpTokensInCvi</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySender.vtCviUsdcLpTokensInUsdc': {
    header: tableType => <span>vtCviUsdcLpTokensInUsdc</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySender.vtCviUsdcLpTokens': {
    header: tableType => <span>vtCviUsdcLpTokens</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiver.vtCviUsdcLpTokensInCvi': {
    header: tableType => <span>vtCviUsdcLpTokensInCvi</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiver.vtCviUsdcLpTokensInUsdc': {
    header: tableType => <span>vtCviUsdcLpTokensInUsdc</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiver.vtCviUsdcLpTokens': {
    header: tableType => <span>vtCviUsdcLpTokens</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    header: tableType => <span>vtCviUsdcLpTokensInCvi(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    header: tableType => <span>vtCviUsdcLpTokensInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCviUsdcLpTokens': {
    header: tableType => <span>vtCviUsdcLpTokens(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    header: tableType => <span>vtCviUsdcLpTokensInCvi(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    header: tableType => <span>vtCviUsdcLpTokensInUsdc(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCviUsdcLpTokens': {
    header: tableType => <span>vtCviUsdcLpTokens(-1b)</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} percentage />,
  },
  usdcReceivedBeforeFees: {
    header: tableType => <span>usdcReceivedBeforeFees</span>,
    value: ({ value, event, table }) => <DisplayNumber state={value} dollar />,
  },
}

const VtUniswapSwapEvent: ReduxState['selectedColumnsInTables']['vt']['VtUniswapSwapEvent'] = {
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  tokenAmountIn: {
    visible: true,
    columnIndex: 0,
  },
  tokenAmountOut: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },

  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}

const VtCviTransferEvent: ReduxState['selectedColumnsInTables']['vt']['VtCviTransferEvent'] = {
  blockNumber: {
    visible: true,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  fromAccount: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  toAccount: {
    visible: true,
    columnIndex: 0,
  },
  cviAmount: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySender.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiver.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventBySenderOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByReceiverOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}

const VtSubmitEvent: ReduxState['selectedColumnsInTables']['vt']['VtSubmitEvent'] = {
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  action: {
    visible: true,
    columnIndex: 0,
  },
  submitFeesAmount: {
    visible: true,
    columnIndex: 0,
  },
  requestTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  targetTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  tokenAmountPaid: {
    visible: true,
    columnIndex: 0,
  },
  useKeepers: {
    visible: false,
    columnIndex: 0,
  },
  maxBuyingPremiumFeePercentage: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },

  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}

const VtLiquidateEvent: ReduxState['selectedColumnsInTables']['vt']['VtLiquidateEvent'] = {
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  useKeepers: {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  liquidator: {
    visible: false,
    columnIndex: 0,
  },
  findersFeeAmount: {
    visible: true,
    columnIndex: 0,
  },
  liquidateTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },

  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}
const VtFulfillEvent: ReduxState['selectedColumnsInTables']['vt']['VtFulfillEvent'] = {
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  useKeepers: {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  fulfillFeesAmount: {
    visible: true,
    columnIndex: 0,
  },
  isAborted: {
    visible: true,
    columnIndex: 0,
  },
  keepersCalled: {
    visible: true,
    columnIndex: 0,
  },
  fulfiller: {
    visible: false,
    columnIndex: 0,
  },
  fulfillTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  action: {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },

  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}

const VtMintEvent: ReduxState['selectedColumnsInTables']['vt']['VtMintEvent'] = {
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  buyingPremiumFee: {
    visible: true,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  positionedTokenAmount: {
    visible: true,
    columnIndex: 0,
  },
  mintedTokens: {
    visible: true,
    columnIndex: 0,
  },
  openPositionFee: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  usdcPaidAfterTimeDelayFee: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },

  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}

const VtBurnEvent: ReduxState['selectedColumnsInTables']['vt']['VtBurnEvent'] = {
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  closePositionFee: {
    visible: true,
    columnIndex: 0,
  },
  closingPremiumFee: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  usdcAmountReceived: {
    visible: true,
    columnIndex: 0,
  },
  usdcReceivedBeforeFees: {
    visible: true,
    columnIndex: 0,
  },
  burnedTokensCvi: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },

  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}

const TvSubmitEvent: ReduxState['selectedColumnsInTables']['tv']['TvSubmitEvent'] = {
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  totalSupply: {
    visible: true,
    columnIndex: 0,
  },
  targetTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  currentThetaVaultUsdcBalance: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  tokenAmount: {
    visible: true,
    columnIndex: 0,
  },
  tokenAmountInUsdc: {
    visible: true,
    columnIndex: 0,
  },
  action: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },

  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}
const TvFulfillDepositEvent: ReduxState['selectedColumnsInTables']['tv']['TvFulfillDepositEvent'] = {
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  submitRequestTokenAmountUsdc: {
    visible: true,
    columnIndex: 0,
  },
  dexVolTokenUSDCAmount: {
    visible: true,
    columnIndex: 0,
  },
  dexVolTokenAmount: {
    visible: true,
    columnIndex: 0,
  },
  dexUSDCAmount: {
    visible: true,
    columnIndex: 0,
  },
  mintedThetaTokens: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  platformLiquidityAmountUsdc: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}
const TvFulfillWithdrawEvent: ReduxState['selectedColumnsInTables']['tv']['TvFulfillWithdrawEvent'] = {
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  usdcAmountReceived: {
    visible: true,
    columnIndex: 0,
  },
  dexVolTokenAmount: {
    visible: true,
    columnIndex: 0,
  },
  dexUSDCAmount: {
    visible: true,
    columnIndex: 0,
  },
  dexUSDCviTokenAmount: {
    visible: true,
    columnIndex: 0,
  },
  burnedThetaTokens: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  platformLiquidityAmountUsdc: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}
const TvLiquidateEvent: ReduxState['selectedColumnsInTables']['tv']['TvLiquidateEvent'] = {
  requestId: {
    visible: true,
    columnIndex: 0,
  },
  blockNumber: {
    visible: false,
    columnIndex: 0,
  },
  blockTimestamp: {
    visible: true,
    columnIndex: 0,
  },
  transactionIndex: {
    visible: false,
    columnIndex: 0,
  },
  transactionHash: {
    visible: false,
    columnIndex: 0,
  },
  account: {
    visible: true,
    columnIndex: 0,
  },
  action: {
    visible: true,
    columnIndex: 0,
  },
  tokenAmount: {
    visible: true,
    columnIndex: 0,
  },
  liquidator: {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.cviIndex': {
    visible: true,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.usdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCvix1BalanceInUsdcInDex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1Balance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.tvCvix1BalanceInUsdc': {
    visible: false,
    columnIndex: 0,
  },

  'generalInfoOfEvent.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvAprByLast30Days': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.cviIndex': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviPriceDexInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvCvix1PriceInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.currentThetaVaultUsdcBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvLockedPercentageOfTvCurrentBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalanceUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformUSDCLiquidity': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.platformVtBalanceUsdcByPlatformPrice': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.dexCviBalance': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvCollateralRatio': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvUtilizationPercentage': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.tvInfo.tvPlatformPnl': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddress.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInCvi': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokensInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventByAddressFromOneBlockBefore.vtCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEvent.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.totalSupplyOfCviUsdcLpTokens': {
    visible: false,
    columnIndex: 0,
  },
  'generalInfoOfEventOneBlockBefore.vtCviUsdcLpTokenWorthInUsdc': {
    visible: false,
    columnIndex: 0,
  },
  logIndex: {
    visible: false,
    columnIndex: 0,
  },
}

export const selectedColumnsInTables: ReduxState['selectedColumnsInTables'] = {
  vt: {
    VtUniswapSwapEvent,
    VtCviTransferEvent,
    VtSubmitEvent,
    VtMintEvent,
    VtLiquidateEvent,
    VtFulfillEvent,
    VtBurnEvent,
  },
  tv: {
    TvSubmitEvent,
    TvFulfillDepositEvent,
    TvFulfillWithdrawEvent,
    TvLiquidateEvent,
  },
}
