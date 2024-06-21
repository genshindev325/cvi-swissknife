import type { FC } from 'react'
import React from 'react'
import classNames from 'classnames'
import TitleIcon from '../VaultInnerPage/VaultInnerPageHeader/TitleIcon'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'

type Props = {
  vaultName: string
}
const VaultInnerPageHeader: FC<Props> = ({ vaultName }) => {
  return (
    <>
      <div
        className={classNames({
          'text-white w-full h-28 rounded-xl bg-dark-600': true,
          // 'bg-dark-700 opacity-20': vaultName === '1X' /* remove after cvi X2 is release*/,
        })}
      >
        <GetSvg
          svgName={vaultName === '1x' ? 'thetax1' : 'thetax2'}
          className="float-right flex mb-auto h-10 w-6 m-2"
        />

        <div className="flex flex-row justify-between items-center h-28  w-full z-20 absolute  px-6">
          <TitleIcon
            iconImg={vaultName === '1x' ? 'cvi' : 'cvi2x'}
            cvi={vaultName?.toUpperCase() ?? '1X'}
            className="pl-4"
            type="main"
          />

          <span className="text-common-lightGray text-sm">USDC</span>
        </div>
        <div
          className={classNames({
            'text-white  h-3/5  rounded-xl ': true,
            'bg-gradient-to-b from-common-blueSky opacity-20 via-common-blueSky': vaultName === '2x',
            'bg-gradient-to-b from-common-lightPink opacity-20 via-common-lightPink': vaultName === '1x',
          })}
        ></div>
      </div>
    </>
  )
}

export default VaultInnerPageHeader
