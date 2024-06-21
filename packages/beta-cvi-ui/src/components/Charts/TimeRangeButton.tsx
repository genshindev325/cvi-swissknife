import { useAppSelector } from 'beta-cvi-ui/src/redux'
import classNames from 'classnames'
import type { FC, SyntheticEvent } from 'react'
import React from 'react'

type Props = {
  title: string
  selected: boolean
  handleClick: (event: SyntheticEvent) => void
}

const TimeRangeButton: FC<Props> = ({ title, selected, handleClick }) => {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const myBtnId = `TR${title}`
  return (
    <button
      id={myBtnId}
      className={`${themeWebSite} ${classNames({
        ' text-white  bg-opacity-40  text-tiny w-6 rounded uppercase hover:outline outline-1 outline-custom-300 active:text-custom-300':
          true,
        'bg-custom-300 active:text-white': selected,
        'bg-[#ffffff1a]': !selected,
      })}`}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default TimeRangeButton
