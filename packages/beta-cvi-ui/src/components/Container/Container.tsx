import type { FC, PropsWithChildren } from 'react'
import Tabs from '../Tabs/Tabs'
import classNames from 'classnames'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { WebSite } from 'beta-cvi-ui/src/types/common.types'
import type { Tab } from 'beta-cvi-ui/src/types/common.types'
import { useLocation } from 'react-router-dom'
import React from 'react'
import { useAddress } from '../../hooks/use-address'

type ContainerProps = {
  title?: Tab[] | string
  className?: string
  activeTab?: string
}

const Container: FC<PropsWithChildren<ContainerProps>> = ({ title, activeTab = '', className, children }) => {
  const { address } = useAddress()
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const location = useLocation()
  return (
    <div
      className={classNames({
        'flex flex-col w-full   rounded-xl text-white ': true,
        [className ?? '']: !!className,
        'bg-dark-650': themeWebSite === WebSite.Armadillo,
        'bg-dark-600': themeWebSite === WebSite.Cvi,
      })}
    >
      <div
        className={`${themeWebSite} ${classNames({
          'w-full h-20 px-4 lg:px-14 flex items-center  rounded-xl rounded-b-none ': true,
          'bg-custom-nav-bg': themeWebSite === WebSite.Armadillo,
          'bg-dark-300 ': themeWebSite === WebSite.Cvi,
        })}`}
      >
        {title instanceof Array ? (
          <Tabs tabs={title} activeTab={activeTab} />
        ) : (
          <h2 className="text-white lg:text-lg font-normal">{title}</h2>
        )}
      </div>
      <div
        className={classNames({
          '  px-4 lg:px-14 xl:14 py-4 xs:py-6 flex-1 ': true,
          'flex items-center ': !address && title !== 'Supported pairs' && location.pathname !== '/dashboard',
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default Container
