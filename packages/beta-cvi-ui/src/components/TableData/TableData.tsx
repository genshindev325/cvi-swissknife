import type { VaultTransactionStatus } from '@coti-cvi/lw-sdk/src'
import classNames from 'classnames'
import type { FC, ReactNode } from 'react'
import React from 'react'
import { useAddress } from '../../hooks/use-address'

type Props = {
  data: string | number | ReactNode
  connectGuard?: boolean
  status: VaultTransactionStatus
  imgsrc?: string
  className?: string
}
const TableData: FC<Props> = ({ data, connectGuard, status, imgsrc, className }) => {
  const { address } = useAddress()

  return (
    <div
      className={classNames({
        '  h-17 text-sm  bg-dark-600 flex items-center ': true,
        'bg-dark-400 border border-dark-400 ': status === 'pending' || (connectGuard && !address),
        [className ?? '']: !!className,
      })}
    >
      <span className={classNames({ 'py-5 flex flex-row gap-2 items-center ': imgsrc !== undefined })}>
        {imgsrc !== undefined && <img src={imgsrc} alt="" />}
        {data}
      </span>
    </div>
  )
}

export default TableData
