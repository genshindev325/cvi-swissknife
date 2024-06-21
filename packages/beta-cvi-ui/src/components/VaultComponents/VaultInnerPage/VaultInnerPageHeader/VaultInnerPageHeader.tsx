import type { FC } from 'react'
import React from 'react'
import classNames from 'classnames'
import TitleIcon from './TitleIcon'
import TitleGroup from './TitleGroup'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
type Props = {
  vaultName: '1x' | '2x'
}
const VaultInnerPageHeader: FC<Props> = ({ vaultName }) => {
  return (
    <>
      <div
        className={classNames({
          'text-white w-full h-44 rounded-xl bg-dark-600': true,
        })}
      >
        <span className="flex flex-row justify-between z-20 absolute w-full">
          <GetSvg svgName={`${vaultName === '1x' ? '1Xvault' : 'bluevault'}`} />
          <GetSvg
            svgName={`${vaultName === '1x' ? 'theta1ximage' : 'thetax2image'}`}
            className={classNames({
              'float-right flex mb-auto': true,
            })}
          />
        </span>

        <div className="flex flex-col md:flex-row md:justify-between w-full h-full z-20 absolute">
          <TitleIcon iconImg="cvi" cvi="1X" className="w-52 h-2/4 md:h-full " type="inner" />
          <TitleGroup />
        </div>
        <div
          className={classNames({
            'text-white  h-3/5 bg-gradient-to-b from-common-blueSky opacity-20 via-common-blueSky rounded-xl ':
              vaultName === '2x',
            'text-white rounded-xl  h-3/5 bg-gradient-to-b from-common-lightPink opacity-20 via-common-lightPink':
              vaultName === '1x',
          })}
        ></div>
      </div>
    </>
  )
}

export default VaultInnerPageHeader
