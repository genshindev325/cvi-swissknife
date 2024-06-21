import { useCallback } from 'react'
import type { PremiumValues } from '../../../lw-sdk/src'
import { CustomError, ErrorKind } from '../../../lw-sdk/src'
import { convertPremiumValues } from '../convert-premium-values'
import { useLocalStorage } from '../hooks/use-local-storage-state'
import useInversify from '../hooks/use-inversify'

const toPremiumPriceLocalStorageId = (id: string) => `il-furmula-ui::premium-price::${id}`

export function usePremiumPriceUsdcCalculator() {
  const [isDebugMode] = useLocalStorage('isDebugMode')
  const { iLProtectionInversifyService, tokenUSDC, globalEventsInversifyService } = useInversify()

  return useCallback(
    async (premiumValues: PremiumValues<number>) => {
      if (!tokenUSDC || !iLProtectionInversifyService || !globalEventsInversifyService) {
        return
      }
      const localStorageId = toPremiumPriceLocalStorageId(JSON.stringify(premiumValues))
      const localStorageValue = localStorage.getItem(localStorageId)
      if (localStorageValue !== null) {
        if (isDebugMode) {
          console.log('found premium-price in localStorage', { premiumValues, result: localStorageValue })
        }
        return Number(localStorageValue)
      }

      if (isDebugMode) {
        console.log('did not found premium-price in localStorage. fetching...', { premiumValues })
      }

      const request = convertPremiumValues({
        from: 'number',
        to: 'BigNumber',
        tokenUSDC,
        values: premiumValues,
      })
      try {
        const result = tokenUSDC.toNumber(await iLProtectionInversifyService.calculateCustomPremiumUsdc(request))
        localStorage.setItem(localStorageId, result.toString())
        return result
      } catch (error) {
        globalEventsInversifyService.eventEmitter.emit(
          'errors',
          new CustomError({
            name: 'CalculatePremiumPriceError',
            message: `could not calculate premium price`,
            errorKind: ErrorKind.SystemError,
            cause: error,
            extras: {
              premiumValues: convertPremiumValues({
                from: 'number',
                to: 'string',
                tokenUSDC,
                values: premiumValues,
              }),
              rawRequest: request,
              asBn: {
                ...Object.fromEntries(
                  Object.entries(request)
                    .filter(([key]) => key !== 'premiumParams')
                    .map(([key, value]) => [key, value.toString()]),
                ),
                premiumParams: Object.fromEntries(
                  Object.entries(request.premiumParams).map(([key, value]) => [key, value.toString()]),
                ),
              },
            },
          }),
        )
      }
    },
    [globalEventsInversifyService, iLProtectionInversifyService, isDebugMode, tokenUSDC],
  )
}
