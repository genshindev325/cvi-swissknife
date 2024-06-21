import type { FC } from 'react'
import { RadioGroup } from '@headlessui/react'
import classNames from 'classnames'

import type { RadioGroupSelectOption } from 'beta-cvi-ui/src/types/common.types'

import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { WebSite } from '@coti-cvi/lw-sdk'

type Props = {
  title: string
  options: RadioGroupSelectOption[]
  selectedKey?: string
  setSelectedValue: React.Dispatch<React.SetStateAction<string | undefined>>
}

const RadioGroupSelect: FC<Props> = ({ title, options, selectedKey, setSelectedValue }) => {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  return (
    <RadioGroup value={selectedKey || options[0]?.key} onChange={setSelectedValue}>
      <RadioGroup.Label className="text-lg font-sans">{title}</RadioGroup.Label>
      <div className="flex flex-row justify-between flex-wrap gap-2 mt-4 overflow-hidden">
        {options.map(({ key, valueToString }) => (
          <RadioGroup.Option key={key} value={key}>
            {({ checked }) => (
              <div
                className={`${themeWebSite} ${classNames({
                  'cursor-pointer whitespace-nowrap w-36 flex-row flex items-center justify-center  bg-common-armadilloBg text-lg border-2 rounded-lg h-12 shadow-sm px-8':
                    true,
                  'border-transparent': !checked,
                  'border-common-orange': checked && themeWebSite === WebSite.Cvi,
                  'border-common-turquoise': checked && themeWebSite === WebSite.Armadillo,
                })}`}
              >
                {valueToString}
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}

export default RadioGroupSelect
