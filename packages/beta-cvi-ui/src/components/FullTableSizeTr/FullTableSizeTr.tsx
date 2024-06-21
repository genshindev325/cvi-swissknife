import type { FC } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import React from 'react'

type Props = {
  className: string
  children: React.ReactElement
}

export const FullTableSizeTr: FC<Props> = ({ children, className }) => {
  const ref = useRef<HTMLTableRowElement>(null)
  const [tableRowWidth, setTableRowWidth] = useState<number>(0)

  useEffect(() => {
    if (ref.current?.parentElement?.clientWidth) {
      setTableRowWidth(ref.current?.parentElement?.clientWidth)
    }
  }, [])

  return (
    <tr ref={ref} style={tableRowWidth > 0 ? { width: tableRowWidth } : {}} className={className}>
      <td className="w-full block">{children}</td>
    </tr>
  )
}
