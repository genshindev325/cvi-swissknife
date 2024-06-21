import {
  VtBurnEventDto,
  VtCviTransferEventDto,
  VtFulfillRequestEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
  VtUniswapSwapEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'

export const vtEventsSwapsAndTransfersTypes = {
  SWAP_EVENT: VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT,
  TRANSFER_EVENT: VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT,
} as const

export const vtEventsTypes = {
  [VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT]: VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT,
  [VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT]: VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT,
  [VtFulfillRequestEventDto.type.VT_FULFILL_EVENT]: VtFulfillRequestEventDto.type.VT_FULFILL_EVENT,
  [VtMintEventDto.type.VT_MINT_EVENT]: VtMintEventDto.type.VT_MINT_EVENT,
  [VtBurnEventDto.type.VT_BURN_EVENT]: VtBurnEventDto.type.VT_BURN_EVENT,
} as const
