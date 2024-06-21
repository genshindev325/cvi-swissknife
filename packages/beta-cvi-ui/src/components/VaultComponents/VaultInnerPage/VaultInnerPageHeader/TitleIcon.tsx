import type { GetSvgProps } from 'beta-cvi-ui/src/utils/GetSvg'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'

type Props = {
  iconImg: GetSvgProps['svgName']
  cvi?: string
  className?: string
  type?: 'main' | 'inner'
}
const TitleIcon: FC<Props> = ({ iconImg, cvi, className, type }) => {
  return (
    <div
      className={classNames({
        'flex flex-row justify-start md:justify-end items-center ': true,
        'pl-4 md:pl-0': type === 'inner',
        ' pl-0': type === 'main',
        [className ?? '']: !!className,
      })}
    >
      <GetSvg svgName={iconImg} />

      <span className="flex flex-col text-center ml-4">
        <b className={classNames({ 'text-lg': true, 'text-left': cvi === '1X' })}>
          CVI<b className="text-common-turquoise">{cvi === '1X' ? '' : cvi}</b>
        </b>
        <span className="text-sm ">Theta Vault</span>
      </span>
    </div>
  )
}

export default TitleIcon
