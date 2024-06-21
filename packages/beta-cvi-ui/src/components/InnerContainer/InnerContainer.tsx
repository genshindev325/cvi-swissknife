import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'

type Props = {
  className?: string
}

const InnerContainer: FC<PropsWithChildren<Props>> = ({ children, className }) => {
  return (
    <div className={classNames({ ' h-4/12 p-4 rounded-2xl': true, [className ?? '']: !!className })}>{children}</div>
  )
}

export default InnerContainer
