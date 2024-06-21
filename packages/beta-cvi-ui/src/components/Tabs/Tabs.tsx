import type { FC } from 'react'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import type { Tab } from '../../types/common.types'
import { WebSite } from '../../../../lw-sdk/src'
import NumberOfRowData from './NumberOfRowData'

type TabsProps = {
  tabs: Tab[]
  activeTab: string
  type?: 'funding_fee'
}
const Tabs: FC<TabsProps> = ({ tabs, activeTab, type }) => {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)

  return (
    <div
      className={classNames({
        'flex gap-6 flex-1 h-full text-lg ': true,
        'ml-4 items-start': type === 'funding_fee',
      })}
    >
      {tabs.map(({ name, path }) => (
        <Link
          key={path}
          to={{
            hash: path,
          }}
        >
          <span
            className={`${themeWebSite} ${cn({
              'h-full text-white flex items-center cursor-pointer w-fit': true,
              'pb-3.5 ': type === 'funding_fee',
              'border-b-4 border-transparent':
                !activeTab.includes(path) || (type === 'funding_fee' && !activeTab.includes(path)),
              'border-b-4 border-custom-300 font-bold ': activeTab.includes(path),
            })}`}
          >
            {themeWebSite === WebSite.Armadillo ? name : <NumberOfRowData name={name} activeTab={activeTab} />}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default Tabs
