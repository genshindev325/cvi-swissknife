import { createSelector } from '@reduxjs/toolkit'
import cloneDeep from 'lodash/cloneDeep'
import type { ReduxState } from './store'

export const selectStateSelector = createSelector([(state: ReduxState) => state], state => state)

export const filteredWalletProtectionsWithoutSelectedProtectionIdsSelector = createSelector(
  [
    (state: ReduxState) => state.walletsProtections,
    (state: ReduxState) => state.selected.accountTypes,
    (state: ReduxState) => state.selected.startProtectionsDateRange,
    (state: ReduxState) => state.selected.endProtectionsDateRange,
    (state: ReduxState) => state.supportedPairs,
    (state: ReduxState) => state.selected.pairs,
    (state: ReduxState) => state.supportedPeriods,
    (state: ReduxState) => state.selected.periods,
    (state: ReduxState) => state.selected.protectionStatuses,
    (state: ReduxState) => state.selected.protectedAmountMin,
    (state: ReduxState) => state.selected.protectedAmountMax,
    (state: ReduxState) => state.selected.embedDiscountsTypes,
    (state: ReduxState) => state.embedStatistics,
  ],
  (
    walletsProtections,
    accountTypes,
    startProtectionsDateRange,
    endProtectionsDateRange,
    supportedPairs,
    selectedPairs,
    supportedPeriods,
    selectedPeriods,
    selectedStatuses,
    selectedProtectedAmountRangeMinimum,
    selectedProtectedAmountRangeMaximum,
    selectedEmbedDiscountsTypes,
    embedStatistics,
  ) => {
    const filteredByWallet = cloneDeep(walletsProtections).filter(walletProtections => {
      if (walletProtections.isInternalWallet) {
        return accountTypes.includes('internal')
      }
      return accountTypes.includes('external')
    })

    for (const walletProtections of filteredByWallet) {
      walletProtections.protections = walletProtections.protections
        .filter(
          p =>
            p.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc >= selectedProtectedAmountRangeMinimum &&
            p.protectionInfo.metadata.lpTokensWorthAtBuyTimeUsdc <= selectedProtectedAmountRangeMaximum,
        )
        .filter(p => {
          if (selectedStatuses.includes('active') && selectedStatuses.includes('expired')) {
            return true
          }
          if (selectedStatuses.includes('active')) {
            return !p.protectionInfo.expiredEvent
          }
          if (selectedStatuses.includes('expired')) {
            return p.protectionInfo.expiredEvent
          }
          return false
        })
        .filter(
          p =>
            Date.now() - startProtectionsDateRange.xDaysAgo * 1000 * 60 * 60 * 24 <=
            p.protectionInfo.boughtEvent.args.protectionStartTimestamp * 1000,
        )
        .filter(p => {
          if (embedStatistics.length === 0) {
            return true
          }
          const { embedDiscount } = p.protectionInfo.metadata
          if (embedDiscount) {
            return selectedEmbedDiscountsTypes.some(r => r.typeId === embedDiscount.discountTypeId)
          }
          return selectedEmbedDiscountsTypes.some(r => r.typeId === 'no-discount')
        })
        .filter(p => {
          return (
            p.protectionInfo.boughtEvent.args.protectionEndTimestamp * 1000 <=
            Date.now() + endProtectionsDateRange.nextXDays * 1000 * 60 * 60 * 24
          )
        })
        .filter(p => {
          if (supportedPairs.length === 0) {
            return true
          }
          return selectedPairs.some(
            selectedPair =>
              (p.protectionInfo.boughtEvent.args.tokenName1.ArmadilloSupportedTokenName === selectedPair.tokenName1 &&
                p.protectionInfo.boughtEvent.args.tokenName2.ArmadilloSupportedTokenName === selectedPair.tokenName2) ||
              (p.protectionInfo.boughtEvent.args.tokenName2.ArmadilloSupportedTokenName === selectedPair.tokenName1 &&
                p.protectionInfo.boughtEvent.args.tokenName1.ArmadilloSupportedTokenName === selectedPair.tokenName2),
          )
        })
        .filter(p => {
          if (supportedPeriods.length === 0) {
            return true
          }
          return selectedPeriods.some(
            selectedPeriod => p.protectionInfo.boughtEvent.args.policyPeriodSeconds === selectedPeriod.periodSeconds,
          )
        })
        .sort(
          (p1, p2) =>
            p2.protectionInfo.boughtEvent.args.protectionStartTimestamp -
            p1.protectionInfo.boughtEvent.args.protectionStartTimestamp,
        )
    }

    return filteredByWallet.filter(walletProtections => walletProtections.protections.length > 0)
  },
)

export const filteredWalletProtectionsSelector = createSelector(
  [filteredWalletProtectionsWithoutSelectedProtectionIdsSelector, (state: ReduxState) => state.selected.protectionIds],
  (walletsProtections, selectedProtectionIds) => {
    const filteredByWallet = cloneDeep(walletsProtections)

    for (const walletProtections of filteredByWallet) {
      walletProtections.protections = walletProtections.protections.filter(
        p => selectedProtectionIds.length === 0 || selectedProtectionIds.includes(p.protectionId),
      )
    }

    return filteredByWallet.filter(walletProtections => walletProtections.protections.length > 0)
  },
)
