import type { FC } from 'react'
import { useState } from 'react'
import { MenuAlt3Icon } from '@heroicons/react/solid'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import { ROUTES, ARMADILLO_ROUTES } from 'beta-cvi-ui/src/config/config'
import SelectNetworkButton from '../NavbarButtons/SelectNetworkButton'
import NavbarLink from '../NavbarLink/NavbarLink'
import classNames from 'classnames'
import { WebSite } from 'beta-cvi-ui/src/context/ConnectWalletProvider/ConnectWalletProvider'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import { useLocalStorage } from '../../hooks/use-local-storage-state'
import closeIcon from 'beta-cvi-ui/src/assets/icons/close_icon.svg'
import Community from '../Community/Community'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import AccumulatedTvp from '../Tvps/AccumulatedTvp'
import Tvp from '../Tvps/Tvp'
import ConnectButton from '../NavbarButtons/ConnectButton'
import { useChain } from 'beta-cvi-ui/src/hooks/use-chain'

type Props = {
  navbarOpen: boolean
  setNavbarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Navbar: FC<Props> = ({ navbarOpen, setNavbarOpen }) => {
  const { selectedChainInfo } = useChain()
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const [fullMode] = useLocalStorage('fullMode')
  const activeNetwork = selectedChainInfo.networkName
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const Routes = () => (themeWebSite === WebSite.Cvi ? ROUTES : ARMADILLO_ROUTES)

  const buttensDisplay = () => {
    return (
      <div className="flex flex-col  lg:flex-row items-center gap-0  lg:gap-6  lg:w-fit  lg:ml-auto   w-full h-full ">
        <SelectNetworkButton navbarOpen={navbarOpen} />
        {/* <Web3Button /> */}
        <ConnectButton type="navbar" className="text-lg lg:text-xs " navbarOpen={navbarOpen} />
      </div>
    )
  }
  const displayTvps = () => {
    return (
      <div className="flex flex-col w-full  sm:flex-row sm:justify-between items-center gap-0  sm:gap-6  sm:w-fit  lg:ml-auto  sm:min-w-[210px]  h-full  sm:mr-6 ">
        <Tvp />
        <AccumulatedTvp />
      </div>
    )
  }
  const openCommunityMenu = () => {
    setIsOpen(true)
  }
  const closeCommunityMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      {' '}
      <nav
        className={`${themeWebSite} ${cn({
          'sticky top-0 z-50 flex w-full  items-center h-20 bg-custom-nav-bg  mb-25': true,
          'xl:pr-6 ': !navbarOpen,
        })}`}
      >
        <div
          className={classNames({
            ' ml-6   flex xl:justify-center  items-center align-stretch  xl:w-fit w-full h-10 ': true,
            '2xl:mr-14 min-w-[222px]': themeWebSite === WebSite.Armadillo,
            '  xl:mr-10 ': themeWebSite === WebSite.Cvi,
          })}
        >
          <Link to="/" className="w-fit h-full">
            {themeWebSite === WebSite.Cvi ? (
              <span className="flex flex-col  text-tiny leading-tight whitespace-nowrap text-white cursor-pointer">
                <GetSvg svgName="cviLogo" className="w-fit  " />
                <span className="text-tiny flex flex-row gap-2">
                  Crypto Volatility Index <GetSvg svgName="betaTag" className="w-fit mt-auto" />
                </span>
              </span>
            ) : (
              <GetSvg className="xl:w-full h-full object-fill" svgName="armadilloLogoBetaTag" />
            )}
          </Link>
        </div>
        <ul
          className={cn({
            ' xl:pt-0 xl:h-full w-fit  xl:w-full ': true,
            'xl:flex flex-row  xl:justify-evenly 2xl:gap-20 2xl:justify-start': themeWebSite === WebSite.Armadillo,
            ' xl:flex  xl:justify-between 2xl:justify-start  2xl:gap-7 xl:mr-5': themeWebSite === WebSite.Cvi,
            'h-screen   xl:overflow-hidden absolute bg-custom-nav-bg top-20  w-screen overflow-y-scroll': navbarOpen,
          })}
        >
          {Routes()
            .filter(({ hideByNetwork, mode }) => !hideByNetwork?.includes(activeNetwork) && mode !== fullMode)
            .map(({ name, path, externalUrl, isNew, subPath }) => (
              <NavbarLink
                key={name}
                id={name}
                name={name}
                path={path}
                subPath={subPath}
                externalUrl={externalUrl}
                navbarOpen={navbarOpen}
                setNavbarOpen={setNavbarOpen}
                openCommunityMenu={openCommunityMenu}
                closeCommunityMenu={closeCommunityMenu}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                isNew={isNew}
              />
            ))}
          {themeWebSite === WebSite.Armadillo && (
            <span
              className={classNames({
                ' hidden sm:hidden  ': !navbarOpen,
                'flex sm:hidden mb-16 ': navbarOpen,
              })}
            >
              {displayTvps()}
            </span>
          )}
          <span
            className={classNames({
              ' hidden lg:hidden ': !navbarOpen,
              'flex lg:hidden mb-16 ': navbarOpen,
            })}
          >
            {buttensDisplay()}
          </span>
        </ul>
        {themeWebSite === WebSite.Armadillo && (
          <span className=" sm:flex hidden h-full  lg:w-3/4 xl:w-fit">{displayTvps()}</span>
        )}
        <span className=" lg:flex hidden h-full">{buttensDisplay()}</span>
        <button
          className=" ml-5 sm:mr-3 md:mr-4 w-24 text-white cursor-pointer text-xl leading-none   border border-solid border-transparent rounded bg-transparent flex justify-center xl:hidden outline-none focus:outline-none"
          type="button"
          onClick={() => setNavbarOpen(!navbarOpen)}
        >
          {!navbarOpen ? (
            <MenuAlt3Icon className="text-white h-10 w-full " />
          ) : (
            <img src={closeIcon} alt="close icon" className="h-10 w-full" />
          )}
        </button>
      </nav>
      <span className="lg:flex relative hidden ">
        {isOpen && <Community openCommunityMenu={openCommunityMenu} closeCommunityMenu={closeCommunityMenu} />}
      </span>
    </>
  )
}

export default Navbar
