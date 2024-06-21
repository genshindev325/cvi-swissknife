import classNames from 'classnames'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'
import MainVaultsHeader from './VaultMainPage/MainVaultsHeader'

type Props = {
  className?: string
  outerDivClassName?: string
  vaultName: string

  type?: 'main' | 'inner'
}

const VaultContainer: FC<PropsWithChildren<Props>> = ({ children, className, outerDivClassName, vaultName, type }) => {
  return (
    <div
      className={classNames({
        ' rounded-xl  md:w-100  bg-dark-600 text-white  flex flex-col ': true,
        [outerDivClassName ?? '']: !!outerDivClassName,
      })}
    >
      {type === 'main' && <MainVaultsHeader vaultName={vaultName} />}
      <div className={classNames({ [className ?? '']: !!className })}>{children}</div>
    </div>
  )
}

export default VaultContainer
