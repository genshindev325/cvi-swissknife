import type { Dashboard } from '@arction/lcjs'
import { lightningChart } from '@arction/lcjs'
import React, { useEffect, useState } from 'react'

export type BuildChartFn = (options: { dashboard: Dashboard; columnIndex: number; rowIndex: number }) => {
  dispose: () => void
}

type Props = {
  id: string
  numberOfColumns: number
  buildChartFns: BuildChartFn[]
  chartHeightVh?: number
}

export function LtDashboard({ id, numberOfColumns, buildChartFns, chartHeightVh = 50 }: Props) {
  const numberOfRows = Math.ceil(buildChartFns.length / numberOfColumns)

  const [dashboard, setDashboard] = useState<Dashboard | undefined>()

  const emptyGraph = buildChartFns.length === 0

  useEffect(() => {
    if (emptyGraph) {
      return
    }

    const lt = lightningChart()
    const newDashboard = lt.Dashboard({
      container: id,
      numberOfRows,
      numberOfColumns,
    })

    setDashboard(newDashboard)

    return () => {
      newDashboard.dispose()
      setDashboard(undefined)
    }
  }, [emptyGraph, id, numberOfColumns, numberOfRows])

  useEffect(() => {
    if (!dashboard) {
      return
    }
    const disposes = buildChartFns.map((buildChart, i) =>
      buildChart({
        dashboard,
        columnIndex: i % numberOfColumns,
        rowIndex: Math.floor(i / numberOfColumns),
      }),
    )
    return () => disposes.forEach(d => d.dispose())
  }, [buildChartFns, dashboard, numberOfColumns])

  return (
    <div className="flex flex-col" style={{ height: chartHeightVh * numberOfRows + 'vh' }}>
      {buildChartFns.length > 0 && <div id={id} style={{ height: '100%' }} />}
    </div>
  )
}
