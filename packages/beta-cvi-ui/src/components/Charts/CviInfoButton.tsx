import classNames from 'classnames'
import type { FC, SyntheticEvent } from 'react'
import React from 'react'

type Props = {
  title: string
  selected: boolean
  handleClick: (event: SyntheticEvent) => void
}

const CviInfoButton: FC<Props> = ({ title, selected, handleClick }) => {
  return (
    <div className="flex flex-col">
      <button
        className={`${classNames({
          ' text-white  bg-opacity-40  text-tiny w-12 rounded uppercase hover:outline outline-1 outline-custom-300 active:text-custom-300':
            true,
          'bg-custom-300 active:text-white': selected,
          'bg-[#ffffff1a]': !selected,
        })}`}
        onClick={handleClick}
        disabled={title === 'cvi2x'}
      >
        {title}
      </button>
      {title === 'cvi2x' && <span className="text-[6px] text-white">COMMING SOON</span>}
    </div>
  )
}

export default CviInfoButton
