/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FC } from 'react'
import Spinner from '../Spinner/Spinner'
import type { State } from '@coti-cvi/lw-sdk/src'
import { WebSite } from '@coti-cvi/lw-sdk/src'
import classNames from 'classnames'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import ConnectButton from '../NavbarButtons/ConnectButton'
import { FullTableSizeTr } from '../FullTableSizeTr/FullTableSizeTr'
import React from 'react'
import { useAddress } from '../../hooks/use-address'

type Props<StateDataArray extends any[]> = {
  state: State<StateDataArray>
  children: [
    React.ReactElement<JSX.IntrinsicElements['thead']>,
    (data: StateDataArray) => React.ReactElement<JSX.IntrinsicElements['tbody']>,
  ]
  className?: string
  tableWidthOverride?: string
  tableClassName?: string
  pendingClassName?: string
  resolvedClassName?: string
  type?: 'transactionsTable' | 'supportedPairsTable'
  connectGuard?: boolean
  name?: string
}

function Table<StateDataArray extends any[]>({
  children,
  state,
  className,
  tableClassName,
  pendingClassName,
  resolvedClassName,
  connectGuard,
  name,
  tableWidthOverride,
}: Parameters<FC<Props<StateDataArray>>>[0]) {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const { address } = useAddress()

  const chooseTableMessage = (name: string) => {
    switch (name) {
      case 'balance':
        return 'You have no volatility tokens in your wallet'
      case 'leaderboard':
        return 'There is no trading data'
      default:
        return `You have no ${name}`
    }
  }

  const noActiveProtectionMessage = () => (
    <div
      className={classNames({
        'flex flex-row items-center gap-6  ': true,
        [resolvedClassName ?? '']: !!resolvedClassName,
      })}
    >
      <GetSvg svgName={themeWebSite === WebSite.Cvi ? 'no-data-cvi' : 'no-data-armadillo'} />
      {themeWebSite === WebSite.Cvi ? (
        <p className="text-small font-[50]">{name ? chooseTableMessage(name) : ''}</p>
      ) : (
        <p className="text-small font-[50]">You have no relevant records</p>
      )}
    </div>
  )

  // because of Warning: validateDOMNesting(...):cannot appear as a child
  const tableBody = (element: React.ReactChild) => {
    return (
      <tbody className="h-full w-full">
        <FullTableSizeTr className="w-full flex">
          <>{element}</>
        </FullTableSizeTr>
      </tbody>
    )
  }

  const renderStatus = () => {
    if (connectGuard && !address) {
      return tableBody(
        <div
          className={classNames({
            'flex items-center justify-center   w-full gap-0': true,
            [resolvedClassName ?? '']: !!resolvedClassName,
          })}
        >
          <span className={classNames({ 'flex stiny:flex-row flex-col ': true })}>
            <span className="text-md flex flex-row items-center justify-center">
              <ConnectButton type="table" className="text-base px-0 pl-0 w-auto items-center" />
              your wallet to view
              <span
                className={classNames({
                  'ml-1': true,
                  flex: !name?.includes(' '),
                  'hidden stiny:flex': name?.includes(' '),
                })}
              >
                {name ?? ''}
              </span>
            </span>
            <span
              className={classNames({
                'm-auto stiny:hidden': name?.includes(' '),
                hidden: !name?.includes(' '),
              })}
            >
              {name ?? ''}
            </span>
          </span>
        </div>,
      )
    }
    switch (state.status) {
      case 'rejected': {
        if (state.data) {
          return children[1](state.data) // render table body, rows
        }
        return tableBody(
          <div
            className={classNames({
              'flex items-center justify-center gap-4 w-full': true,
              [resolvedClassName ?? '']: !!resolvedClassName,
            })}
          >
            Failed to fetch {name}.
          </div>,
        )
      }

      case 'pending': {
        if (state.data) {
          return children[1](state.data) // render table body, rows
        }

        return tableBody(
          <Spinner
            className={classNames({
              'h-8 w-8 border-2 ml-4  mt-4': true,
              [pendingClassName ?? '']: !!pendingClassName,
            })}
          />,
        )
      }

      case 'resolved': {
        if (state.data.length === 0) {
          return tableBody(
            <div
              className={classNames({
                'flex items-center justify-center gap-4 w-full': true,
                [resolvedClassName ?? '']: !!resolvedClassName,
              })}
            >
              {noActiveProtectionMessage()}
            </div>,
          )
        }
        return children[1](state.data) // render table body, rows
      }
    }
  }

  return (
    <div
      className={classNames({
        'relative overflow-x-auto lg:overflow-x-visible  lg:right-4': true,
        'w-fit lg:w-[calc(100%+2rem)]': !tableWidthOverride,
        [tableWidthOverride ?? '']: !!tableWidthOverride,
        [className ?? '']: !!className,
      })}
    >
      <table
        cellSpacing={0}
        cellPadding={0}
        className={classNames({
          'w-full text-sm text-left table-fixed border-0 overflow-x-auto': true,
          [tableClassName ?? '']: !!tableClassName,
        })}
      >
        {connectGuard && !address ? null : children[0]}
        {renderStatus()}
      </table>
    </div>
  )
}

export default Table
