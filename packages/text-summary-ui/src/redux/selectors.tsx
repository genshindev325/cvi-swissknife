import { createSelector } from '@reduxjs/toolkit'
import type { ReduxState } from './store'

export const selectStateSelector = createSelector([(state: ReduxState) => state], state => state)
