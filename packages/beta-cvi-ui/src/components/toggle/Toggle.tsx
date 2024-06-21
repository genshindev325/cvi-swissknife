import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'

type Props = {
  title: string
  isToggle: boolean
  setIsToggle?: React.Dispatch<React.SetStateAction<boolean>>
  onClick: () => void
  toggleClassNameIfToggle?: string
  toggleClassNameIfNotToggle?: string
  switchClassNameIfToggle?: string
  switchClassNameIfNotToggle?: string
}

const Toggle: FC<Props> = ({
  title,
  isToggle,
  setIsToggle,
  onClick,
  toggleClassNameIfToggle,
  toggleClassNameIfNotToggle,
  switchClassNameIfToggle,
  switchClassNameIfNotToggle,
}) => {
  return (
    <>
      <div
        onClick={onClick}
        className={classNames({
          'w-16 h-5  rounded-md flex items-center  cursor-pointer': true,
          'outline outline-1 outline-custom-btc': isToggle && !switchClassNameIfToggle,
          'bg-[#374151]': !isToggle && !switchClassNameIfNotToggle,
          [switchClassNameIfToggle ?? '']: !!switchClassNameIfToggle && isToggle,
          [switchClassNameIfNotToggle ?? '']: !!switchClassNameIfNotToggle && !isToggle,
        })}
      >
        {isToggle && <span className="text-white ml-2">off</span>}
        <span
          className={classNames({
            'rounded w-7 text-center m-1': true,
            'translate-x-2': isToggle,
            'bg-custom-btc ': isToggle && !toggleClassNameIfToggle,
            'bg-[#ffffff]': !isToggle && !toggleClassNameIfNotToggle,
            [toggleClassNameIfToggle ?? '']: !!toggleClassNameIfToggle && isToggle,
            [toggleClassNameIfNotToggle ?? '']: !!toggleClassNameIfNotToggle && !isToggle,
          })}
        >
          {title}
        </span>
        {!isToggle && <span className="text-white ml-1">on</span>}
      </div>
    </>
  )
}

export default Toggle
