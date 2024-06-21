import { useAppSelector } from '../redux/hooks'
import { useILChainId } from '../hooks/useILChainId'
import { useState } from 'react'
import classNames from 'classnames'
import Container from '../components/Container/Container'
import ConnectButton from '../components/NavbarButtons/ConnectButton'
import { useWallet } from '../hooks/useWallet'
import React from 'react'
import { useAddress } from '../hooks/use-address'

export const CheckArmadilloEligibleDiscountPage = () => {
  const chainId = useILChainId()
  const { address } = useAddress()
  const { globalEventsInversifyService } = useWallet()
  const themeWebSite = useAppSelector(state => state.state.themeWeb)

  const [isEligible, setIsEligible] = useState<boolean>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleClick = async () => {
    if (address && globalEventsInversifyService) {
      setIsLoading(true)
      try {
        setIsEligible(await new Promise(resolve => setTimeout(() => resolve(true), 300)))
      } catch (error) {
        globalEventsInversifyService.eventEmitter.emit('errors', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  function render() {
    if (address) {
      if (isEligible === true) {
        return <span className=" text-common-turquoise">Eligible!</span>
      }
      if (isEligible === false) {
        return <span className=" text-common-lightRed">Not Eligible!</span>
      }
      return (
        <button
          className="rounded-md px-4 bg-custom-300 hover:text-common-lightGray  hover:bg-custom-300-opacity-20 hover:outline outline-1 outline-custom-300  bg-opacity-50     hover:shadow-2xl active:text-custom-300 active:bg-custom-win-bg"
          disabled={!address || isLoading || !globalEventsInversifyService}
          onClick={() => handleClick()}
        >
          {isLoading ? 'Checking...' : 'Check'}
        </button>
      )
    } else {
      return <ConnectButton type="navbar" className="w-full p-1 text-lg lg:text-xs" />
    }
  }

  return (
    <div className="px-6 mt-6 text-white flex justify-center">
      <Container
        title="Check eligibility for a free Armadillo protection"
        className={classNames({
          'xl:w-7/12': true,
        })}
      >
        <div className="flex flex-col gap-3">
          <span className="flex flex-col gap-2">
            <span>
              Armadillo is giving away <b>$4000</b>
            </span>
            <span className="flex gap-2">
              Part of the DeFi ecosystem? check your eligibility: <span className="h-fit mt-auto ">{render()}</span>
            </span>
            <span>
              Premiums purchased by whitelisted users up until the 22nd of August will be refunded - up to $25 per user.
            </span>
          </span>
          <ul className="flex flex-col gap-2">
            <li>
              1. Follow{' '}
              <a
                className="underline underline-offset-4 text-custom-300"
                href="https://twitter.com/Armadillo_ILP"
                target="_blank"
                rel="noopener noreferrer"
              >
                Armadillo on Twitter
              </a>
            </li>
            <li>
              2. Follow{' '}
              <a
                className="underline underline-offset-4 text-custom-300"
                href="https://twitter.com/official_cvi"
                target="_blank"
                rel="noopener noreferrer"
              >
                CVI on Twitter
              </a>
            </li>

            <li>
              3. Protect your liquidity at
              <a
                className="underline underline-offset-4 text-custom-300 ml-1"
                href="https://www.armadillo.is/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Armadillo
              </a>
            </li>
            <li>
              4. Comment on our{' '}
              <a
                className="underline underline-offset-4 text-custom-300"
                href="https://twitter.com/Armadillo_ILP/status/1559530265722191878"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter post
              </a>{' '}
              or DM{' '}
              <a
                className="underline underline-offset-4 text-custom-300 "
                href="https://twitter.com/Armadillo_ILP"
                target="_blank"
                rel="noopener noreferrer"
              >
                Armadillo on Twitter
              </a>{' '}
              with your TxHash.
            </li>
            <li className="leading-tight">
              <p> 5. Automatically receive accrued IL as a payout directly to your wallet at the expiration date.</p>
              <p>
                In addition, the premium cost will be refunded - Up to $25 on top of the Impermanent Loss that has
                occurred.
              </p>
            </li>
            <li className="flex flex-col gap-4">
              <span>* The free protection is limited to 1 protection per user.</span>{' '}
            </li>
            <li className="flex items-center gap-1 ">
              <div
                className={`${themeWebSite} ${classNames({
                  'max-w-[0.50rem] max-h-[0.50rem] w-[0.50rem] h-[0.50rem] bg-custom-300  rounded-full mr-1': true,
                })}`}
              ></div>{' '}
              <b className="text-lg">
                {' '}
                200 $GOVI will be raffled between those who will retweet this{' '}
                <a
                  className="underline underline-offset-4 text-custom-300"
                  href="https://twitter.com/Armadillo_ILP/status/1559530265722191878"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  thread
                </a>
              </b>
              {/* <div
                className={`${themeWebSite} ${classNames({
                  'ml-1 max-w-[0.50rem] max-h-[0.50rem] w-[0.50rem] h-[0.50rem] bg-custom-300  rounded-full mr-1': true,
                })}`}
              ></div> */}
            </li>
          </ul>
        </div>
      </Container>
    </div>
  )
}
