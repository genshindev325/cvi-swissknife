import cn from 'classnames'
import type { FC, PropsWithChildren } from 'react'

type Props = {
  className?: string
}

const Spinner: FC<PropsWithChildren<Props>> = ({ className }) => {
  return (
    <span
      className={cn({
        'min-w-2 min-h-2 border-white border-b-transparent rounded-full inline-flex animate-spin': true,
        [className ?? '']: !!className,
        'w-8 h-8 border-4 border-solid': !className,
      })}
    ></span>
  )
}

export default Spinner
