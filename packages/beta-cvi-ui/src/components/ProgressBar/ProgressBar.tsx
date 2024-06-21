import type { FC } from 'react'
import React from 'react'
type Props = {
  bgColor: string
  progress: number
  active?: boolean
}
const ProgressBar: FC<Props> = ({ bgColor, progress, active }) => {
  const Childdiv = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: bgColor,
  }
  return <div className="h-2 w-full bg-progressBar-background">{active ? <div style={Childdiv}></div> : null}</div>
}

export default ProgressBar
