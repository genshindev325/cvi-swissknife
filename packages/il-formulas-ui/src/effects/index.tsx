import type { BigNumber } from 'ethers'
import { useEffect } from 'react'
import usePromise from 'react-use-promise'
import type { PremiumValues } from '../../../lw-sdk/src'
import {
  CustomError,
  ErrorKind,
  transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber,
} from '../../../lw-sdk/src'
import { convertPremiumValuesWithoutParams } from '../convert-premium-values-without-params'
import { useLocalStorage } from '../hooks/use-local-storage-state'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import useInversify from '../hooks/use-inversify'
import { usePremiumPriceUsdcCalculator } from './use-premium-price-usdc-calculator'

export function Effects() {
  const dispatch = useAppDispatch()
  const [isDebugMode] = useLocalStorage('isDebugMode')
  const {
    iLProtectionInversifyService,
    tokenUSDC,
    globalEventsInversifyService,
    cviOracleInversifyService,
    ilContractsInversifyService,
  } = useInversify()
  const overridenValues = useAppSelector(state => state.state.overridenValues)
  const pyParabolaBaseUrls = useAppSelector(state => state.state.pyParabolaBaseUrls)
  const selectedPairAndPeriod = useAppSelector(state => state.state.selectedPairAndPeriod)

  const [contractPremiumValuesWithoutParams] = usePromise(async () => {
    if (
      !cviOracleInversifyService ||
      !ilContractsInversifyService ||
      !iLProtectionInversifyService ||
      !globalEventsInversifyService ||
      !tokenUSDC
    ) {
      return
    }
    try {
      if (isDebugMode) {
        console.log('get premium values without params from contract')
      }

      const [
        cvi,
        totalLPTokensWorthAtBuyTimeUsdc,
        expectedLPTokensValueGrowth,
        liquidityUsdc,
        maxILProtectedPercentage,
        premiumGrowthStart,
        premiumSlope,
      ] = await Promise.all([
        cviOracleInversifyService.getCviIndex(),
        ilContractsInversifyService.controller
          .totalLPTokensWorthAtBuyTimeUSD()
          .then(r => tokenUSDC.fromNumber(Math.floor(tokenUSDC.toNumber(r)))),
        iLProtectionInversifyService.getExpectedLPTokensValueGrowth(),
        ilContractsInversifyService.liquidity
          .liquidity()
          .then(r => tokenUSDC.fromNumber(Math.floor(tokenUSDC.toNumber(r)))),
        iLProtectionInversifyService.getMaxILProtectedPercentage(),
        ilContractsInversifyService.config.premiumGrowthStart(),
        ilContractsInversifyService.config.premiumSlope(),
      ])

      const contractValuesAsBigNumbers: Omit<PremiumValues<BigNumber>, 'premiumParams'> = {
        cvi: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
          tokenUSDC,
          propertyName: 'cvi',
          propertyValue: cvi.cviNumber,
        }),
        totalLPTokensWorthAtBuyTimeUsdc,
        expectedLPTokensValueGrowth: expectedLPTokensValueGrowth.bn,
        liquidityUsdc,
        maxILProtectedPercentage: maxILProtectedPercentage.bn,
        lpTokensWorthAtBuyTimeUsdc: transformCalculateCustomPremiumUsdcParamsPropertyValueToBigNumber({
          tokenUSDC,
          propertyName: 'lpTokensWorthAtBuyTimeUsdc',
          propertyValue: 100,
        }),
        premiumGrowthStart,
        premiumSlope,
      }

      const contractValuesWithoutParams = await convertPremiumValuesWithoutParams({
        from: 'BigNumber',
        to: 'number',
        tokenUSDC,
        values: contractValuesAsBigNumbers,
      })

      if (isDebugMode) {
        console.log('received premium values without params from contract', {
          contractValues: contractValuesWithoutParams,
        })
      }
      return contractValuesWithoutParams
    } catch (error) {
      globalEventsInversifyService.eventEmitter.emit(
        'errors',
        new CustomError({
          name: 'getPremiumValuesError',
          message: `could not get premium values without params from contract`,
          errorKind: ErrorKind.SystemError,
          cause: error,
        }),
      )
    }
  }, [
    cviOracleInversifyService,
    ilContractsInversifyService,
    iLProtectionInversifyService,
    globalEventsInversifyService,
    isDebugMode,
    tokenUSDC,
  ])

  useEffect(() => {
    if (contractPremiumValuesWithoutParams) {
      dispatch(actions.setContractPremiumValuesWithoutParams(contractPremiumValuesWithoutParams))
    }
  }, [contractPremiumValuesWithoutParams, dispatch])

  useEffect(() => {
    if (contractPremiumValuesWithoutParams && selectedPairAndPeriod) {
      dispatch(
        actions.setOverridenValues({
          ...contractPremiumValuesWithoutParams,
          premiumParams: selectedPairAndPeriod.premiumParams,
        }),
      )
    }
  }, [contractPremiumValuesWithoutParams, dispatch, selectedPairAndPeriod])

  const calculatePremiumPrice = usePremiumPriceUsdcCalculator()

  const [premiumPriceFromOverridenValues] = usePromise(async () => {
    if (overridenValues) {
      if (isDebugMode) {
        console.log('calculating premium price using overridenValues', { overridenValues })
      }
      const result = await calculatePremiumPrice(overridenValues)
      if (result !== undefined) {
        if (isDebugMode) {
          console.log('calculated premium price using overridenValues', { overridenValues, result })
        }
      }
      return result
    }
  }, [overridenValues, isDebugMode, calculatePremiumPrice])

  useEffect(() => {
    if (premiumPriceFromOverridenValues !== undefined) {
      dispatch(actions.setPremiumPriceUsdcFromOverridenValues(premiumPriceFromOverridenValues))
    }
  }, [dispatch, premiumPriceFromOverridenValues])

  useEffect(() => {
    const get = async () => {
      if (iLProtectionInversifyService) {
        const result = await iLProtectionInversifyService.getAntonCurrentPremiumParams({ baseUrl: pyParabolaBaseUrls })
        dispatch(actions.setAntonData(result))
      }
    }
    const id = setInterval(get, 20_000)
    get()
    return () => clearInterval(id)
  }, [dispatch, iLProtectionInversifyService, pyParabolaBaseUrls])

  const [periods] = usePromise(
    async () => iLProtectionInversifyService?.getPeriodsSeconds(),
    [iLProtectionInversifyService],
  )
  const [pairs] = usePromise(async () => iLProtectionInversifyService?.getPairs(), [iLProtectionInversifyService])

  useEffect(() => {
    if (pairs) {
      dispatch(actions.setPairs(pairs))
    }
  }, [dispatch, pairs])

  useEffect(() => {
    if (periods) {
      dispatch(actions.setPeriods(periods))
    }
  }, [dispatch, periods])

  return null
}
