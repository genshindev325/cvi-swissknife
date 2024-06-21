import type { RequestStatus } from '@coti-cvi/lw-sdk'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'

import cn from 'classnames'
import type { FC, PropsWithChildren } from 'react'
import Spinner from '../Spinner/Spinner'

type Props = {
  disabled?: boolean
  status?: RequestStatus
  type: 'common' | 'submit' | 'connect' | 'approve' | 'receive'
  title: string
  className?: string
  titleClassName?: string
  onClick: () => void
}

const Button: FC<PropsWithChildren<Props>> = ({
  status,
  type,
  title,
  titleClassName,
  className,
  disabled,
  onClick,
}) => {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)

  return (
    // <div className={classNames({ 'w-full ': type === 'connect' })}>
    <>
      <button
        disabled={disabled}
        className={`${themeWebSite} ${cn({
          'rounded-lg  uppercase text-base w-full cursor-pointer hover:bg-opacity-50 h-14  ': true,
          'bg-common-cancel font-bold  hover:border border-common-cancel  hover:shadow-2xl active:text-common-lightGray':
            type === 'common',
          'bg-custom-300  hover:bg-custom-300-opacity-20 hover:border border-custom-300  bg-opacity-50  font-bold   hover:shadow-2xl active:text-custom-300 active:bg-custom-win-bg':
            type === 'submit' || type === 'connect',
          'bg-common-blueSky hover:border border-common-blueSky font-bold hover:border-common-blueSky active:bg-dark-700 ':
            type === 'approve',
          'bg-common-turquoise hover:border border-common-turquoise font-bold hover:border-common-turquoise active:bg-dark-700':
            type === 'receive',
          'pointer-events-none opacity-80': status === 'pending',
          'pointer-events-none text-opacity-70 opacity-40': disabled,
          [className ?? '']: !!className,
        })}`}
        type="button"
        onClick={onClick}
      >
        {status === 'pending' ? (
          <>
            <Spinner className="h-4 w-4 border-2 mr-2 relative top-[2px] " />
            <span>Processing...</span>
          </>
        ) : (
          <span
            className={cn({
              [titleClassName ?? '']: !!titleClassName,
            })}
          >
            {title}
          </span>
        )}
      </button>
      {/* </div> */}
    </>
  )
}

export default Button
