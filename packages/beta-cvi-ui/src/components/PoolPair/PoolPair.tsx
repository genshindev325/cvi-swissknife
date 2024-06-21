import type { FC, PropsWithChildren } from 'react'
import type { ProtectionDetails } from '@coti-cvi/lw-sdk'
import DisplayNumber from '../DisplayNumber/DisplayNumber'
import { Stator } from '@coti-cvi/lw-sdk'
import classNames from 'classnames'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'

type Props = Pick<ProtectionDetails, 'tokenName1' | 'tokenName2'> & {
  protection?: number
  className?: string
  type?: 'modal'
}

const PoolPair: FC<PropsWithChildren<Props>> = ({ tokenName1, tokenName2, protection, className = 'hidden', type }) => {
  return (
    <div
      className={classNames({
        'flex flex-wrap  justify-start items-center mr-1': true,
      })}
    >
      <span className={classNames({ 'pr-2 flex  items-center gap-1 ': true, 'gap-1 ': type === 'modal' })}>
        <GetSvg
          svgName={tokenName1}
          className={classNames({ 'w-8 h-10 relative ': type !== 'modal', 'w-full h-14  ': type === 'modal' })}
        />
        <GetSvg
          svgName={tokenName2}
          className={classNames({ 'w-8 h-10 relative': type !== 'modal', 'w-full h-14 ': type === 'modal' })}
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-md  w-28">{`${tokenName1}/${tokenName2}`}</span>

        <span className={classNames({ 'text-sm': true, [className ?? '']: !!className })}>
          <span className="pr-1">Your liquidity:</span>

          {protection && <DisplayNumber state={Stator.resolve(protection)} className="font-bold " dollar={true} />}
        </span>
      </span>
    </div>
  )
}

export default PoolPair
