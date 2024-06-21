import type { Dispatch, FC, SetStateAction } from 'react'
import { useState } from 'react'
import cn from 'classnames'
import type { SlippageOptions } from '../../config/config'
import { SLIPPAGESELECT } from '../../config/config'

type Props = {
  isOpen: boolean
  slippage: number
  setSlippage: React.Dispatch<React.SetStateAction<number>>
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const SlippageSelect: FC<Props> = ({ slippage, setSlippage, setIsOpen, isOpen }) => {
  const [selectSlippage, setSelectSlippage] = useState<SlippageOptions>(slippage)
  const [customInput, setCustonInput] = useState<string>('')
  const [isInputElementFocus, setIsInputElementFocus] = useState(false)

  const handleClick = ({ currentTarget: { id } }: React.MouseEvent<HTMLButtonElement, MouseEvent>, slippage = 0.1) => {
    if (window.gtag) {
      window.gtag('event', 'choose_slippage', {
        page_title: 'choose_slippage',
        choose_slippage_title: `User choose ${slippage} slippage`,
        description: 'User chose slippage by clicking',
        page_path: window.location.pathname,
      })
    }
    setCustonInput('')
    setSelectSlippage(Number(id))
    setSlippage(slippage)
  }

  const handleChange = ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const val = value
    if (!isNaN(Number(val)) && val.length <= 2) {
      setCustonInput(val)
      setSlippage(Number(val))
    } else if (val.includes('.')) {
      if (val.length <= val.indexOf('.') + 3) {
        if (!isNaN(Number(val))) {
          setCustonInput(val)
          setSlippage(Number(val))
        }
      }
    }
  }
  // prevent user to type - , +, e, E
  const blockInvalidChar = (e: React.KeyboardEvent<HTMLInputElement>) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()

  const handleFocus = () => {
    setIsInputElementFocus(true)
    setCustonInput(slippage.toString())
  }

  const handleOnBlur = () => {
    setIsInputElementFocus(false)
    if (slippage > 50) {
      setSlippage(0.1)
      setCustonInput('0.1')
    }
  }
  const showWarning = (slippage > 1 && slippage <= 50) || slippage > 50 || slippage < 0.05
  return (
    <>
      <div
        className={cn({
          ' flex flex-col  border border-common-cancel justify-center leading-tight w-80  sm:w-102 bg-custom-slippage-bg h-20 rounded-2xl':
            true,
          'h-28 ': showWarning,
        })}
      >
        {/* {!switchToCustom ? ( */}
        <div className="flex flex-row text-sm gap-3 justify-center  sm:justify-evenly items-center ">
          {SLIPPAGESELECT.map((slct, i) => {
            return typeof slct === 'number' ? (
              <button
                key={slct}
                id={`${slct}`}
                onClick={event => handleClick(event, slct)}
                className={cn({
                  'flex justify-center items-center  cursor-pointer h-12 w-16 sm:w-20 rounded-lg drop-shadow-lg bg-dark-300 hover:bg-common-cancel active:text-custom-300  ':
                    true,
                  'outline outline-1 outline-common-orange': selectSlippage === slct && !isInputElementFocus,
                })}
              >
                {`${slct}%`}
              </button>
            ) : (
              <span
                key={slct}
                id={`${slct}`}
                className={cn({
                  'flex flex-row h-12 w-16 sm:w-20  rounded-lg  bg-dark-300  ': true,
                  'outline outline-1 outline-common-orange': isInputElementFocus,
                })}
              >
                <input
                  onFocus={() => handleFocus()}
                  onBlur={() => handleOnBlur()}
                  onChange={event => handleChange(event)}
                  onKeyDown={event => blockInvalidChar(event)}
                  className={cn({
                    'h-12  pl-1 rounded-lg  bg-dark-300  focus:outline-none  ': true,
                    'w-16': !customInput,
                    'w-12 sm:w-14': customInput,
                  })}
                  placeholder="Custom"
                  value={customInput ?? ''}
                  autoComplete="off"
                />
                {customInput !== '' && (
                  <span className="bg-dark-300 pr-2 h-12 mt-auto flex items-center w-fit text-common-lightGray">%</span>
                )}
              </span>
            )
          })}
        </div>
        <div
          className={cn({
            'h-6 pl-4 pt-1 mb-1': true,
            'h-0 pt-0': !showWarning,
          })}
        >
          {(slippage > 1 && slippage <= 50 && (
            <span className="text-yellow-500 text-xs">Your transaction may be frontrun due to high slippage</span>
          )) ||
            (slippage > 50 && (
              <span className="text-common-lightRed text-xs ">Enter a valid slippage percentage</span>
            )) ||
            (slippage < 0.05 && (
              <span className="text-yellow-600 text-xs">Your transaction may fail due to low slippage</span>
            ))}
        </div>
      </div>
    </>
  )
}

export default SlippageSelect
