import { useAppSelector } from 'beta-cvi-ui/src/redux'
import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import { safeObjectEntries } from '../../../../lw-sdk/src'

type Props<T extends Record<string, string>> = {
  options: T
  stateTab: keyof T
  className?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Slider<T extends Record<string, string>>({ options, stateTab, className }: Parameters<FC<Props<T>>>[0]) {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const tabs = safeObjectEntries(options).map(entrie => ({ name: entrie[0].toString(), path: entrie[1].toString() }))
  if (tabs.length === 0 || tabs.length > 2) {
    throw new Error(`Slider: tabs length must be 1 or 2`)
  }
  return (
    <div
      className={classNames({
        'rounded-lg stiny:rounded-2xl bg-dark-700 flex flex-row gap-2': true,
        'h-12 stiny:h-17 p-1 stiny:p-2': !className,
        [className ?? '']: !!className,
      })}
    >
      {tabs.map(({ name, path }) => {
        return (
          <Link key={path} to={{ hash: path }} className="w-2/4">
            <span
              className={`${themeWebSite} ${classNames({
                'h-full text-white flex flex-row w-full justify-center uppercase  items-center cursor-pointer': true,
                ' rounded-lg stiny:rounded-2xl bg-dark-300 outline-none font-bold': options[stateTab].includes(path),
                'rounded-lg stiny:rounded-2xl hover:outline outline-1 outline-dark-300 hover:outline-dark-300 text-common-lightGray':
                  !options[stateTab].includes(path),
              })}`}
            >
              {name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default Slider
