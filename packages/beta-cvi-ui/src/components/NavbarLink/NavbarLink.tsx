import type { FC, PropsWithChildren } from 'react'
import cn from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import Community from '../Community/Community'
import classNames from 'classnames'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import { WebSite } from '@coti-cvi/lw-sdk'
type Props = {
  id: string
  name: string
  path: string
  subPath?: string[]
  externalUrl?: string
  isNew?: boolean
  navbarOpen: boolean
  setNavbarOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  openCommunityMenu: () => void
  closeCommunityMenu: () => void
}

const NavbarLink: FC<PropsWithChildren<Props>> = ({
  name,
  path,
  navbarOpen,
  externalUrl,
  isNew,
  subPath,
  isOpen,
  setIsOpen,
  setNavbarOpen,
  openCommunityMenu,
  closeCommunityMenu,
  id,
}) => {
  const location = useLocation()
  const themeWebSite = useAppSelector(state => state.state.themeWeb)

  const newTagElement = () => {
    return isNew && <span className="text-common-lightGreen text-tiny xl:pl-1">NEW!</span>
  }

  const checkSubPath = () => {
    let isSubPath = false
    subPath?.forEach(sp => {
      if (location.pathname === sp) {
        isSubPath = true
      }
    })
    return isSubPath
  }

  const handleClickLink = ({ currentTarget: { id } }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (id !== 'Community') {
      setNavbarOpen(false)
      closeCommunityMenu()
    } else if (id === 'Community') {
      if (isOpen) {
        closeCommunityMenu()
      } else {
        openCommunityMenu()
      }
    }
  }

  return (
    <li
      id={id}
      onMouseOver={e => {
        if (e.currentTarget.id === 'Community') {
          openCommunityMenu()
        }
      }}
      onMouseOut={closeCommunityMenu}
      className={`${themeWebSite} ${cn({
        'flex xl:w-34 flex-col text-center sm:justify-center text-md items-center nav-item text-white px-10 sm:px-0 lg:px-1':
          true,
        'xl:border-b-4 xl:border-custom-300 ': checkSubPath() || location.pathname === path,

        'xl:border-b-4 xl:border-custom-nav-bg': location.pathname !== path && !checkSubPath(),

        'border-b border-b-custom-600 w-full   first:border-t first:border-t-custom-600 sm:text-2xl py-4 sm:h-36 font-normal':
          navbarOpen,

        'hidden xl:flex ': !navbarOpen,
      })}`}
    >
      {externalUrl ? (
        <a
          href={externalUrl}
          target={externalUrl === 'https://v2.cvi.finance/' ? '_self' : '_blank'}
          rel="noopener noreferrer nofollow"
        >
          <span
            className={cn({
              'flex flex-row justify-between items-end xl:items-center w-full': true,
            })}
          >
            <span
              className={cn({
                'text-white opacity-75 hover:opacity-60': true,

                'pr-2': navbarOpen,
              })}
            >
              {name}
            </span>
            {newTagElement()}
          </span>
        </a>
      ) : (
        <>
          <Link to={`${path !== '/community' ? path : location.pathname}`}>
            <span
              className={cn({
                'text-white': true,
                ' xl:font-bold  whitespace-nowrap opacity-100':
                  (location.pathname === path && name !== 'Community') || checkSubPath(),
                'text-white opacity-75 hover:opacity-60': location.pathname !== path || name === 'Community',
                'pr-2 text-custom-300': navbarOpen && location.pathname === path,
                'flex flex-row items-center sm:justify-center  ': name === 'Community',
              })}
            >
              <span id={id} className="whitespace-nowrap " onClick={handleClickLink}>
                {name}
              </span>
              <span>
                {name === 'Community' && isOpen !== undefined && (
                  <GetSvg
                    svgName="chevron"
                    className={classNames({
                      'block transition duration-200 ': true,
                      'rotate-180': isOpen,
                      'fill-custom-300': themeWebSite === WebSite.Cvi,
                    })}
                  />
                )}
              </span>
            </span>
            {newTagElement()}
          </Link>
          <span className={classNames({ 'xl:hidden block  ': true })}>
            {isOpen && name === 'Community' && <Community navbarOpen={navbarOpen} />}
          </span>
        </>
      )}
    </li>
  )
}

export default NavbarLink
