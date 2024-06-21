import classNames from 'classnames'
import type { ReactNode } from 'react'
import React from 'react'

type Props<Tab extends string> = {
  type: string
  tabs: Tab[]
  selectedRequestTable: Tab
  children?: (selectedEventsTable: Tab) => ReactNode
  onClick: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Tabs<Tab extends string>({ tabs, type, selectedRequestTable, onClick, children }: Props<Tab>) {
  return (
    <>
      {tabs.map((value, index) => (
        <div key={index} className="flex items-center mb-4 relative">
          {children ? children(value) : null}
          <input
            checked={selectedRequestTable === value}
            id={`default-radio-${value}-${type}`}
            type="radio"
            value={value}
            onChange={onClick}
            name={`default-radio-${value}-${type}`}
            className="w-4 h-4 hidden"
          />
          <label
            htmlFor={`default-radio-${value}-${type}`}
            className={classNames({
              'px-4 py-2 m-2 rounded-lg bg-dark-400  cursor-pointer capitalize text-sm': true,
              'border-2 border-orange-400': selectedRequestTable === value,
            })}
          >
            {value}
          </label>
        </div>
      ))}
    </>
  )
}
