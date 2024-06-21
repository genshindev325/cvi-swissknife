import type { BigNumber } from 'ethers'

/**
 * {
  id: '0xaa400d4220d42889cf781dc4d627f336a811a153e68723d3eac60e37f7a8e1fe'
  blockNumber: '24485572'
  timestamp: '1643858157'
  account: '0x157eb56657ff05a120383bfd2894c9024e37203f'
  tokenAmount: '347605879'
  feeAmount: '1042816'
  positionUnitsAmount: '870652086'
  leverage: 3
  cviValue: '7961'
}
 */
export type PolygonOpenPositionRaw = {
  id: string
  blockNumber: string
  timestamp: string
  account: string
  tokenAmount: string
  feeAmount: string
  positionUnitsAmount: string
  leverage: number
  cviValue: string
}

export type PolygonOpenPosition = {
  eventType: 'OpenPosition'
  id: string
  blockNumber: number
  epochSeconds: number
  dateUtc: string
  account: string
  tokenAmount: BigNumber
  feeAmount: BigNumber
  positionUnitsAmount: BigNumber
  leverage: number
  cviValue: BigNumber
}

/**
   * {
    id: 0x0009ba317acc06b60b91043f7f19948f2fca777c9a9c3b2ed53b4b9ae55351fb
    platformAddress: '0x88d01ef3a4d586d5e4ce30357ec57b073d45ff9d',
    blockNumber: '18863293',
    timestamp: '1631057201',
    account: '0xbdc88a34c80a731dd8bb172e2b8adbe227c72f0e',
    tokenAmount: '13244322406',
    feeAmount: '88282602',
    positionUnitsAmount: '0',
    leverage: 1,
    cviValue: '9957'
  }
   */
export type PolygonClosePositionRaw = {
  id: string
  platformAddress: string
  blockNumber: string
  timestamp: string
  account: string
  tokenAmount: string
  feeAmount: string
  positionUnitsAmount: string
  leverage: number
  cviValue: string
}

export type PolygonClosePosition = {
  eventType: 'ClosePosition'
  id: string
  platformAddress: string
  blockNumber: number
  epochSeconds: number
  dateUtc: string
  account: string
  tokenAmount: BigNumber
  feeAmount: BigNumber
  positionUnitsAmount: BigNumber
  leverage: number
  cviValue: BigNumber
}
