import React, { useState, Fragment } from 'react'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { Listbox } from '@headlessui/react'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import classNames from 'classnames'
export const tokens = [
  {
    name: 'CVI',
    version: '1X',
  },
]

type Token = { name: string; version: string; label: string } | { name: string; version: string; label?: undefined }

const SelectToken = () => {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const [selectedToken, setSelectedToken] = useState(tokens[0])

  const selectedOption = (token: Token) => {
    return (
      <>
        <GetSvg svgName={`cvi`} className="w-8" />
        <b className="text-lg">
          {token.name}
          <b className="text-lg text-common-turquoise">{token.version === '1X' ? '' : token.version}</b>
        </b>

        {/* <span className="ml-1 pt-2 text-xs">{token.label !== undefined ? token.label : ''}</span> */}
      </>
    )
  }

  return (
    <div className={`${themeWebSite} flex flex-col w-full text-white gap-4 relative text-lg`}>
      <span className="flex flex-row justify-between">
        <span>Select Token</span>
        <a
          className="flex flex-row items-center gap-1 text-custom-300 text-xs"
          href="https://docs.cvi.finance/"
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            if (window.gtag) {
              window.gtag('event', 'how_it_works_link', {
                page_title: 'how_it_works_link',
                how_it_works_link_title: 'Click on how it works link',
                description: 'The user clicked on "How it works" link',
                page_path: window.location.pathname,
              })
            }
          }}
        >
          How it works <GetSvg svgName={'popLink'} className="cursor-pointer fill-custom-300" />
        </a>
      </span>

      <Listbox value={selectedToken} onChange={() => setSelectedToken(tokens[0])}>
        {({ open }) => (
          <>
            <Listbox.Button
              className={'flex justify-between h-14 bg-dark-300 items-center px-4 rounded-tl-2xl rounded-tr-2xl'}
            >
              <span className="flex items-center gap-1 uppercase">{selectedOption(selectedToken)}</span>
              <GetSvg
                svgName="chevron"
                className={classNames({
                  'block ml-auto transition duration-200 fill-common-orange': true,
                  'rotate-180': open,
                })}
              />
            </Listbox.Button>

            {open && (
              <div className="absolute z-50 bg-dark-600 w-full -bottom-14">
                <Listbox.Options>
                  {tokens.map((token, i) => (
                    /* Use the `active` state to conditionally style the active option. */
                    /* Use the `selected` state to conditionally style the selected option. */
                    <Listbox.Option key={token.version} value={token.name} as={Fragment}>
                      <li
                        className={classNames({
                          'bg-[#f8ba151A]  text-white rounded-bl-2xl rounded-br-2xl flex items-center gap-1 px-4 h-14 hover:bg-[#182f5d] active:bg-[#264fa1]':
                            true,
                          // 'bg-[#f8ba151A]  text-white': selectedToken.version === token.version,
                          // 'rounded-bl-2xl rounded-br-2xl': tokens.length - 1 === i,
                        })}
                      >
                        {selectedOption(token)}
                      </li>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            )}
          </>
        )}
      </Listbox>
    </div>
  )
}

export default SelectToken
