import { BigNumber } from 'ethers'
import type { FC } from 'react'
import { useMemo } from 'react'
import usePromise from 'react-use-promise'
import { Combobox, Multiselect } from 'react-widgets'
import { convertPremiumParams } from '../convert-premium-params'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import type { SelectedPairAndPeriod } from '../types'
import useInversify from '../hooks/use-inversify'
import { useSeriesDownloader } from '../hooks/use-series-downloader'
import { CHART_NAMES } from '../utils'
import fuzzysort from 'fuzzysort'
import type { RenderItemProp } from 'react-widgets/cjs/List'
import uniqBy from 'lodash/uniqBy'

type Props = {}

type SourcePairPeriodItem = {
  type: 'source-pair-period'
  data: SelectedPairAndPeriod
}

type Item =
  | SourcePairPeriodItem
  | {
      type: 'source-pair-with-all-periods'
      data: Pick<SelectedPairAndPeriod, 'chainId' | 'source' | 'pair'>
      withAllPeriods: SelectedPairAndPeriod[]
    }
  | {
      type: 'source-periods-with-all-pairs'
      data: Pick<SelectedPairAndPeriod, 'chainId' | 'source' | 'period'>
      withAllPairs: SelectedPairAndPeriod[]
    }

const toString = (item: Item) => {
  switch (item.type) {
    case 'source-pair-period':
      return `${item.data.source} - ${item.data.period.periodSecondsFormat} - ${item.data.pair.tokenName1}/${item.data.pair.tokenName2}`
    case 'source-pair-with-all-periods':
      return `${item.data.source} - all periods -${item.data.pair.tokenName1}/${item.data.pair.tokenName2}`
    case 'source-periods-with-all-pairs':
      return `${item.data.source} - ${item.data.period.periodSecondsFormat} - all pairs`
  }
}

const filter = (item: Item, searchTerm: string): boolean => {
  const result = fuzzysort.single(searchTerm, toString(item))
  return Boolean(result)
}

const fuzzySearch = ({ item, searchTerm }: Parameters<RenderItemProp<Item>>[0]) => {
  if (!item) {
    return <span />
  }
  if (searchTerm) {
    const result = fuzzysort.single(searchTerm, toString(item))
    if (result) {
      const r = fuzzysort.highlight(result, '<b>', '</b>')
      if (r) {
        return <span dangerouslySetInnerHTML={{ __html: r }} />
      }
    }
  }
  return <span>{toString(item)}</span>
}

const textField = (value: Item | string): string => {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return toString(value)
}

export const ChangePairAndPeriod: FC<Props> = () => {
  const queue = useSeriesDownloader()
  const dispatch = useAppDispatch()
  const { ilContractsInversifyService, tokenUSDC } = useInversify()
  const {
    chainId,
    pairs,
    antonData,
    periods,
    selectedPairAndPeriods,
    selectedPairAndPeriod,
    contractPremiumValuesWithoutParams,
  } = useAppSelector(state => state.state)

  const [fromContract = []] = usePromise<SelectedPairAndPeriod[]>(async () => {
    if (!ilContractsInversifyService || !tokenUSDC) {
      return []
    }

    const result = await Promise.all(
      pairs.map<Promise<SelectedPairAndPeriod[]>>(pair =>
        Promise.all(
          periods
            .filter(period => period.periodSeconds >= 60 * 60 * 24)
            .map<Promise<SelectedPairAndPeriod>>(async period => ({
              chainId,
              source: 'contract',
              pair,
              period,
              premiumParams: convertPremiumParams({
                from: 'BigNumber',
                to: 'number',
                tokenUSDC,
                values: await ilContractsInversifyService.tokenPairRepository.getPremiumParams(
                  pair.tokenName1,
                  pair.tokenName2,
                  BigNumber.from(period.periodSeconds),
                ),
              }),
            })),
        ),
      ),
    )
    return result.flat()
  }, [chainId, ilContractsInversifyService, pairs, periods, tokenUSDC])

  const fromAnton: SelectedPairAndPeriod[] = useMemo(
    () =>
      antonData
        .map<SelectedPairAndPeriod>(a => ({
          chainId,
          source: 'anton',
          pair: a.pair,
          period: a.period,
          premiumParams: a.premiumParams,
        }))
        .filter(r => fromContract.some(c => c.period.periodSeconds === r.period.periodSeconds)),
    [antonData, chainId, fromContract],
  )

  const allSelectedPairAndPeriod = useMemo(
    () =>
      [...fromContract, ...fromAnton]
        .filter(r => selectedPairAndPeriods.every(r1 => JSON.stringify(r) !== JSON.stringify(r1)))
        .sort((a, b) => a.period.periodSeconds - b.period.periodSeconds),
    [fromAnton, fromContract, selectedPairAndPeriods],
  )

  const allMultiselectItems = useMemo<Item[]>(() => {
    return [
      ...uniqBy(
        allSelectedPairAndPeriod,
        item => `${item.chainId}-${item.source}-${item.pair.tokenName1}-${item.pair.tokenName2}`,
      ).map<Item>(data => ({
        type: 'source-pair-with-all-periods',
        data: {
          chainId: data.chainId,
          source: data.source,
          pair: data.pair,
        },
        withAllPeriods: allSelectedPairAndPeriod.filter(
          r =>
            r.chainId === data.chainId &&
            r.source === data.source &&
            ((r.pair.tokenName1 === data.pair.tokenName1 && r.pair.tokenName2 === data.pair.tokenName2) ||
              (r.pair.tokenName2 === data.pair.tokenName1 && r.pair.tokenName1 === data.pair.tokenName2)),
        ),
      })),
      ...uniqBy(
        allSelectedPairAndPeriod,
        item => `${item.chainId}-${item.source}-${item.period.periodSeconds}`,
      ).map<Item>(data => ({
        type: 'source-periods-with-all-pairs',
        data: {
          chainId: data.chainId,
          source: data.source,
          period: data.period,
        },
        withAllPairs: allSelectedPairAndPeriod.filter(
          r =>
            r.chainId === data.chainId &&
            r.source === data.source &&
            r.period.periodSeconds === data.period.periodSeconds,
        ),
      })),
      ...allSelectedPairAndPeriod.map<Item>(data => ({ type: 'source-pair-period', data })),
    ]
  }, [allSelectedPairAndPeriod])

  const allComboboxItems = useMemo<SourcePairPeriodItem[]>(
    () => selectedPairAndPeriods.map<SourcePairPeriodItem>(data => ({ type: 'source-pair-period', data })),
    [selectedPairAndPeriods],
  )

  return (
    <div style={{ border: '1px', borderStyle: 'solid', borderWidth: 'thin', width: '300px' }}>
      <div>Choose Period/Pair:</div>
      <Multiselect
        renderListItem={item => fuzzySearch(item)}
        // @ts-ignore
        textField={textField}
        filter={filter}
        groupBy={item => {
          switch (item.type) {
            case 'source-pair-period':
              return item.data.period.periodSecondsFormat
            case 'source-pair-with-all-periods':
              return `${item.data.pair.tokenName1}/${item.data.pair.tokenName2}`
            case 'source-periods-with-all-pairs':
              return item.data.period.periodSecondsFormat
          }
        }}
        data={allMultiselectItems}
        busy={allMultiselectItems.length === 0 || !contractPremiumValuesWithoutParams}
        disabled={!contractPremiumValuesWithoutParams}
        onChange={newSelected => {
          if (!contractPremiumValuesWithoutParams) {
            return
          }
          const newSelectedPairAndPeriods = newSelected.flatMap(item => {
            switch (item.type) {
              case 'source-pair-period':
                return [item.data]
              case 'source-pair-with-all-periods':
                return item.withAllPeriods
              case 'source-periods-with-all-pairs':
                return item.withAllPairs
            }
          })
          dispatch(actions.setSelectedPairAndPeriods(newSelectedPairAndPeriods))
          const newToDownload = newSelectedPairAndPeriods.filter(s =>
            selectedPairAndPeriods.every(c => JSON.stringify(c) !== JSON.stringify(s)),
          )
          for (const selectedPairAndPeriod of newToDownload) {
            for (const chartName of CHART_NAMES) {
              queue.push({
                chartName,
                selectedPairAndPeriod,
                premiumValues: {
                  ...contractPremiumValuesWithoutParams,
                  premiumParams: selectedPairAndPeriod.premiumParams,
                },
              })
            }
          }
        }}
      />
      Select to override values:
      <Combobox
        style={{
          width: '300px',
        }}
        renderListItem={item => fuzzySearch(item)}
        // @ts-ignore
        textField={textField}
        filter={filter}
        data={allComboboxItems}
        disabled={allComboboxItems.length === 0}
        value={
          selectedPairAndPeriod && {
            type: 'source-pair-period',
            data: selectedPairAndPeriod,
          }
        }
        groupBy={(item: SourcePairPeriodItem) => item.data.period.periodSecondsFormat}
        onChange={selected => typeof selected !== 'string' && dispatch(actions.setSelectedPairAndPeriod(selected.data))}
      />
    </div>
  )
}
