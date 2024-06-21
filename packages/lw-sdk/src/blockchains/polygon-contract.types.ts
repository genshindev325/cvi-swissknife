/**
 * raw response from contract to a single call:
 * {
 status: 'fulfilled'
 value: {
   '0': '140604014162'
   '1': true
   '2': '369887175744'
   '3': '1'
   '4': '822347483'
   '5': '0'
   currentPositionBalance: '140604014162'
   isPositive: true
   positionUnitsAmount: '369887175744'
   leverage: '1'
   fundingFees: '822347483'
   marginDebt: '0'
  }
}
*/
export type CurrentPositionFulfilled = {
  status: 'fulfilled'
  value: {
    '0': string
    '1': boolean
    '2': string
    '3': string
    '4': string
    '5': string
    currentPositionBalance: string
    isPositive: boolean
    positionUnitsAmount: string
    leverage: string
    fundingFees: string
    marginDebt: string
  }
}
export type CurrentPositionRawResponse =
  | CurrentPositionFulfilled
  | {
      status: 'rejected'
      reason: Error
    }
