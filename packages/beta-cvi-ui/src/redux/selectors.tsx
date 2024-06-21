import { Stator } from '@coti-cvi/lw-sdk/src'
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './store'

export const selectState = createSelector([(state: RootState) => state.state], state => state)

export const selectAddress = createSelector([selectState], state => state.impersolatedAddress || state.providerAddress)

const tvProgressBarPersentage = createSelector([selectState], state =>
  Stator.deriveState(
    [state.cvi.tv.tvlUsdc, state.cvi.tv.maxCapacityUsdc],
    ([tvlUsdc, maxCapacityUsdc]) => (tvlUsdc / maxCapacityUsdc) * 100,
  ),
)

export const selectors = {
  selectState,
  selectAddress,
  tvProgressBarPersentage,
}
