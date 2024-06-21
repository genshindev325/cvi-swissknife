import type { FC } from 'react'
import { useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import millify from 'millify'
import { useAppSelector } from '../../redux'
import '../../styles/globals.scss'
import type { Point } from '@coti-cvi/lw-sdk'
import { Box, Checkbox, FormControlLabel } from '@mui/material'
import { format } from 'date-fns'
import capitalize from 'lodash/capitalize'
import { protectionTooltipToString } from '../../utils'
import type { IlBackendClientApi } from '@coti-cvi/auto-generated-code/src'
import { filteredWalletProtectionsSelector } from '../../redux/selectors'

const TYPES = ['start', 'end'] as const

type Selected = typeof TYPES[number]

type Props = {}

type Serie = {
  name: string
  color: string
  data: Point[]
}

export const ProtectionsDurationsChart: FC<Props> = () => {
  const filteredWalletsProtections = useAppSelector(filteredWalletProtectionsSelector)

  const [selected, setSelected] = useState<Selected[]>(['start', 'end'])
  const series = useMemo<Serie[]>(() => {
    if (selected.length === 0) {
      return []
    }
    let highestPayout = 0

    const gerProtectionColor = (protection: IlBackendClientApi.ProtectionIdWithInfoDto) =>
      protection.protectionInfo.expiredEvent ? '#E9967A' : '#6495ED'
    const results = filteredWalletsProtections.flatMap(w =>
      w.protections.map<Serie>(p => {
        const end = p.protectionInfo.status.withoutMinPayout.payoutOrDuePayoutUsdc

        if (selected.includes('start') && selected.includes('end')) {
          highestPayout = Math.max(highestPayout, p.protectionInfo.boughtEvent.args.premiumCostUSD, end)
          return {
            name: p.protectionId,
            color: gerProtectionColor(p),
            data: [
              [
                p.protectionInfo.boughtEvent.args.protectionStartTimestamp * 1000,
                p.protectionInfo.boughtEvent.args.premiumCostUSD,
              ],
              [p.protectionInfo.boughtEvent.args.protectionEndTimestamp * 1000, end],
            ],
          }
        }

        if (selected.includes('start')) {
          highestPayout = Math.max(highestPayout, p.protectionInfo.boughtEvent.args.premiumCostUSD)
          return {
            name: p.protectionId,
            color: gerProtectionColor(p),
            data: [
              [
                p.protectionInfo.boughtEvent.args.protectionStartTimestamp * 1000,
                p.protectionInfo.boughtEvent.args.premiumCostUSD,
              ],
            ],
          }
        }

        if (selected.includes('end')) {
          highestPayout = Math.max(highestPayout, end)
          return {
            name: p.protectionId,
            color: gerProtectionColor(p),
            data: [[p.protectionInfo.boughtEvent.args.protectionEndTimestamp * 1000, end]],
          }
        }

        throw new Error(`can't be here`)
      }),
    )

    if (selected.includes('start') && selected.includes('end')) {
      return results.concat([
        {
          name: 'now',
          color: '#40E0D0',
          data: [
            [Date.now(), 0],
            [Date.now(), highestPayout],
          ],
        },
      ])
    }

    return results
  }, [selected, filteredWalletsProtections])

  return (
    <div>
      <div>
        {selected.length === 2
          ? `Protections Price $ -> Payout $`
          : selected.includes('start')
          ? `Protections Bought`
          : `Protections expired`}
      </div>
      {TYPES.map(type => (
        <Box key={type}>
          <FormControlLabel
            label={`Protections ${capitalize(type)} Date`}
            control={
              <Checkbox
                checked={selected.includes(type)}
                onChange={(_, checked) =>
                  setSelected(prev => (checked ? [...prev, type] : prev.filter(r => r !== type)))
                }
              />
            }
          />
        </Box>
      ))}
      <Chart
        key={JSON.stringify(selected)}
        type={selected.length === 2 ? 'line' : 'scatter'}
        height={450}
        width={'90%'}
        series={series}
        options={{
          colors: series.map(s => s.color),
          stroke: {
            width: 1,
          },
          chart: {
            foreColor: 'white',
            zoom: {
              enabled: true,
              type: 'x',
              autoScaleYaxis: true,
            },
            animations: {
              enabled: false,
            },
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
              autoSelected: 'zoom',
            },
          },
          xaxis: {
            type: 'datetime',
            tickAmount: 10,
            title: {
              text:
                selected.length === 2
                  ? 'Start Protection Date -> End Protection Date'
                  : selected.includes('end')
                  ? 'End Protection Date'
                  : 'Start Protection Date',
              style: { color: 'white' },
            },
            labels: {
              style: { colors: 'white' },
              formatter: ms => format(new Date(Number(ms)), 'dd/MM HH:mm'),
            },
          },
          yaxis: {
            tickAmount: 7,
            title: {
              text:
                selected.length === 2
                  ? 'Premium Price $ -> Payout $'
                  : selected.includes('end')
                  ? 'Payout $'
                  : 'Premium Price $',
              style: { color: 'white' },
            },
            labels: {
              style: { colors: 'white' },
              formatter: y => millify(y) + '$',
            },
          },
          tooltip: {
            y: {
              formatter: (
                val: number,
                {
                  dataPointIndex,
                  series: onlyXValuesArray,
                  seriesIndex,
                }: { dataPointIndex: number; series: number[]; seriesIndex: number },
              ) => {
                if (filteredWalletsProtections.length === 0 || series[seriesIndex].name === 'now') {
                  return ''
                }
                const protection = filteredWalletsProtections
                  .flatMap(p => p.protections)
                  .find(p => p.protectionId === series[seriesIndex].name)?.protectionInfo

                if (!protection) {
                  throw new Error(`can't be here`)
                }

                return protectionTooltipToString(protection)
              },
            },
          },
        }}
      />
    </div>
  )
}
