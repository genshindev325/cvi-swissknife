import type {
  VtBurnEventDto,
  VtFulfillRequestEventDto,
  VtLiquidateRequestEventDto,
  VtMintEventDto,
  VtSubmitRequestEventDto,
} from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { VtUniswapSwapEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import { VtCviTransferEventDto } from '@coti-cvi/auto-generated-code/src/backend-client-apis/cvi-backend-swagger-client'
import classNames from 'classnames'
import type { FC } from 'react'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import useInversify from '../../hooks/use-inversify'
import { EventsTable } from '../events-table'
import { useFilteredEvents } from '../../hooks/use-filtered-events'
import { Tabs } from '../Tabs'
import { vtEventsTypes } from './types'
import { vtEventsSwapsAndTransfersTypes } from './types'
import type { VtSwapsAndTransferEvents } from '@coti-cvi/lw-sdk/src'
import { getAddressGroupAndName } from '@coti-cvi/lw-sdk/src'
import { AddressGroup } from '@coti-cvi/lw-sdk/src'
import { RequestsTableByStatus } from '../RequestTableByStatus'
import { getStatusOfVtRequest } from '../../utils'

const ADDITIONAL_TABS = ['all', 'Transfers To Wallets'] as const

type AdditionalTabs = typeof ADDITIONAL_TABS[number]

type Props = {
  address?: string
}

const TABS = [
  ADDITIONAL_TABS[0],
  ...Object.values(vtEventsTypes),
  ...Object.values(vtEventsSwapsAndTransfersTypes),
  ADDITIONAL_TABS[1],
] as const

export const VtRequestsAndEventsTables: FC<Props> = ({ address }) => {
  const [selectedTab, setSelectedTab] = useState<
    | VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT
    | VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
    | VtSubmitRequestEventDto.type.VT_SUBMIT_EVENT
    | VtLiquidateRequestEventDto.type.VT_LIQUIDATE_EVENT
    | VtFulfillRequestEventDto.type.VT_FULFILL_EVENT
    | VtMintEventDto.type.VT_MINT_EVENT
    | VtBurnEventDto.type.VT_BURN_EVENT
    | AdditionalTabs
  >('all')
  const { vtRequests, vtTransferAndSwapEventsAsc } = useFilteredEvents()
  const { cviContractsInversifyService } = useInversify()

  const requestsWithStatus = useMemo(
    () => vtRequests.filter(r => selectedTab === 'all' || getStatusOfVtRequest(r) === selectedTab),
    [vtRequests, selectedTab],
  )

  const filterSwapAndTransferEventByTab = useCallback(
    (
      event: VtSwapsAndTransferEvents,
      tab:
        | VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT
        | VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
        | typeof ADDITIONAL_TABS[1],
    ): boolean => {
      if (tab === 'Transfers To Wallets') {
        return Boolean(
          event.type === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT &&
            cviContractsInversifyService &&
            getAddressGroupAndName(event.args.fromAccount, cviContractsInversifyService).addressGroup !==
              AddressGroup.CVI_CONTRACTS &&
            getAddressGroupAndName(event.args.fromAccount, cviContractsInversifyService).addressGroup !==
              AddressGroup.DEX_CONTRACTS &&
            getAddressGroupAndName(event.args.toAccount, cviContractsInversifyService).addressGroup !==
              AddressGroup.CVI_CONTRACTS &&
            getAddressGroupAndName(event.args.toAccount, cviContractsInversifyService).addressGroup !==
              AddressGroup.DEX_CONTRACTS,
        )
      }

      return event.type === tab
    },
    [cviContractsInversifyService],
  )

  const onClickRadioButtonEvents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTab = TABS.find(s => s === e.target.value)
    if (selectedTab) {
      setSelectedTab(selectedTab)
    } else {
      throw new Error(`can't be here`)
    }
  }

  return useMemo(
    () => (
      <>
        <div className="flex mt-4 flex-col">
          <div className="w-full flex">
            <Tabs
              type="swaps-transfers"
              tabs={[...TABS]}
              onClick={onClickRadioButtonEvents}
              selectedRequestTable={selectedTab}
            >
              {tab => {
                let rows: number
                if (tab === 'all') {
                  rows = vtTransferAndSwapEventsAsc.length + vtRequests.length
                } else {
                  if (
                    tab === 'Transfers To Wallets' ||
                    tab === VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT ||
                    tab === VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT
                  ) {
                    rows = vtTransferAndSwapEventsAsc.filter(e => filterSwapAndTransferEventByTab(e, tab)).length
                  } else {
                    rows = vtRequests.filter(r => getStatusOfVtRequest(r) === tab).length
                  }
                }
                return (
                  <span
                    className={classNames({
                      'top-0 right-0 absolute bg-dark-800 rounded-full w-6 h-6 text-xs flex justify-center items-center':
                        true,
                      'bg-green-600': rows > 0,
                    })}
                  >
                    <span className="flex item-center justify-center">{rows}</span>
                  </span>
                )
              }}
            </Tabs>
          </div>
          {(() => {
            switch (selectedTab) {
              case 'all':
                return [
                  ...Object.values(vtEventsTypes).map(table => (
                    <RequestsTableByStatus
                      key={table}
                      showAccountAddress={!address}
                      requests={requestsWithStatus}
                      selectedRequestTable={table}
                    />
                  )),
                  ...Object.values(vtEventsSwapsAndTransfersTypes).map(table => (
                    <EventsTable
                      key={table}
                      table={table}
                      events={vtTransferAndSwapEventsAsc.filter(e => e.type === table)}
                      showAccountAddress={true}
                    />
                  )),
                ]
              case 'Transfers To Wallets':
                return (
                  <EventsTable
                    table={VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT}
                    tableRename={selectedTab}
                    events={vtTransferAndSwapEventsAsc.filter(e => filterSwapAndTransferEventByTab(e, selectedTab))}
                    showAccountAddress={true}
                  />
                )
              case VtUniswapSwapEventDto.type.VT_UNISWAP_SWAP_EVENT:
              case VtCviTransferEventDto.type.VT_CVI_TRANSFER_EVENT:
                return (
                  <EventsTable
                    table={selectedTab}
                    events={vtTransferAndSwapEventsAsc.filter(e => filterSwapAndTransferEventByTab(e, selectedTab))}
                    showAccountAddress={true}
                  />
                )
              default:
                return (
                  <RequestsTableByStatus
                    showAccountAddress={!address}
                    requests={requestsWithStatus}
                    selectedRequestTable={selectedTab}
                  />
                )
            }
          })()}
        </div>
      </>
    ),
    [address, filterSwapAndTransferEventByTab, requestsWithStatus, selectedTab, vtRequests, vtTransferAndSwapEventsAsc],
  )
}
