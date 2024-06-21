import { safeObjectEntries } from '@coti-cvi/lw-sdk/src'
import { useMemo } from 'react'
import { Multiselect } from 'react-widgets'
import type { BuildCommonCharts } from '../components/build-common-charts'
import type { BuildTvCharts } from '../components/tv/charts/tv-build-charts'
import type { BuildChartFn } from '../components/vt/charts/lt-chart'
import { LtDashboard } from '../components/vt/charts/lt-chart'
import type { BuildVtCharts } from '../components/vt/charts/vt-build-charts'
import { useCommonCharts } from '../hooks/use-common-charts'
import { actions, useAppDispatch, useAppSelector } from '../redux'
import type { ChartName } from '../redux/types'

export function humanChartName(chartName: ChartName): string {
  return chartName
    .replace('build', '')
    .replace('Chart', '')
    .replace('InUsdc', '$')
    .replace('Usdc', '$')
    .replace('Usd', '$')
}

function getChartClassMethods<T extends BuildCommonCharts | BuildTvCharts | BuildVtCharts>(
  chartInstances: (T | undefined)[],
): [ChartName, BuildChartFn][] {
  const result: [ChartName, BuildChartFn][] = []
  for (const charts of chartInstances) {
    if (charts) {
      result.push(
        // @ts-expect-error
        ...safeObjectEntries(charts).flatMap(entrie =>
          typeof entrie[1] === 'function' ? [[entrie[0], entrie[1].bind(charts)]] : [],
        ),
      )
    }
  }
  return result
}

export const Charts = () => {
  const dispatch = useAppDispatch()
  const { commonCharts, tvCharts, vtCharts } = useCommonCharts()
  const selectedChartNames = useAppSelector(state => state.selectedChartNames)
  const namesWithFunctionsEntries = useMemo(
    () => getChartClassMethods([commonCharts, tvCharts, vtCharts]),
    [commonCharts, tvCharts, vtCharts],
  )

  const selectedNamesWithFunctionsEntries = useMemo(
    () => namesWithFunctionsEntries.filter(e => selectedChartNames.includes(e[0])),
    [namesWithFunctionsEntries, selectedChartNames],
  )

  return (
    <div>
      <div>Charts:</div>
      <Multiselect
        className="w-full"
        data={namesWithFunctionsEntries.map(e => e[0])}
        value={selectedChartNames}
        onChange={newSelected => dispatch(actions.setSelectedCharts(newSelected))}
        renderListItem={item => humanChartName(item.item)}
        renderTagValue={tag => humanChartName(tag.item)}
      />
      {selectedNamesWithFunctionsEntries.map((entrie, i) => (
        <div key={entrie[0]}>
          <LtDashboard id={`chart-${entrie[0]}`} numberOfColumns={1} buildChartFns={[entrie[1]]} />
        </div>
      ))}
    </div>
  )
}
