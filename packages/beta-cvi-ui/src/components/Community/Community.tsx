import classNames from 'classnames'
import type { FC, MouseEvent } from 'react'
import { useState } from 'react'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import { WebSite } from '@coti-cvi/lw-sdk'
import { MODE } from '@coti-cvi/lw-sdk'
import { useLocalStorage } from '../../hooks/use-local-storage-state'
import type { GetSvgProps } from 'beta-cvi-ui/src/utils/GetSvg'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
type Props = {
  navbarOpen?: boolean
  isOpen?: boolean
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
  openCommunityMenu?: () => void
  closeCommunityMenu?: () => void
}

const Community: FC<Props> = ({ openCommunityMenu, closeCommunityMenu, navbarOpen }) => {
  const themeWebSite = useAppSelector(state => state.state.themeWeb)
  const [fullMode] = useLocalStorage('fullMode')
  const [titleHover, setTitleHover] = useState('')
  const [titleClick, setTitleClick] = useState('')

  const handleHover = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    setTitleHover(event.currentTarget.id)
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    setTitleClick(event.currentTarget.id)
  }

  const resetHoverAndClick = () => {
    setTitleClick('')
    setTitleHover('')
  }
  const socialLink: { title: GetSvgProps['svgName']; url: string }[] = [
    {
      title: 'twitter',
      url:
        themeWebSite === WebSite.Armadillo ? 'https://twitter.com/Armadillo_ILP' : 'https://twitter.com/official_cvi',
    },
    { title: 'telegram', url: 'https://t.me/cviofficial' },
    {
      title: 'discord',
      url:
        themeWebSite === WebSite.Armadillo ? 'https://discord.com/invite/yuDsy7SM2H' : 'https://discord.gg/yuDsy7SM2H',
    },
    {
      title: 'medium',
      url: themeWebSite === WebSite.Armadillo ? 'https://medium.com/@Armadillo_ILP' : 'https://cviofficial.medium.com',
    },
    themeWebSite === WebSite.Armadillo
      ? {
          title: 'youtube',
          url: 'https://www.youtube.com/channel/UC1dVW-EUY7bEQVoNwCqGA6A',
        }
      : {
          title: 'defiPulse',

          url: 'https://www.defipulse.com/address-tag/crypto-volatility-index',
        },
    {
      title: 'github',
      url:
        themeWebSite === WebSite.Armadillo
          ? 'https://github.com/govi-dao/armadillo-contracts-integration'
          : 'https://github.com/govi-dao/cvi-contracts',
    },
    {
      title: 'governance',

      url: 'https://vote.cvi.finance/',
    },
  ]

  return (
    <div
      onMouseOver={openCommunityMenu}
      onMouseOut={closeCommunityMenu}
      className={classNames({
        'xl:relative xl:top-[5rem]  bg-custom-nav-bg  text-white ': true,
        '2xl:left-[30.2rem] ': themeWebSite === WebSite.Armadillo,
        'xl:left-[33.7%] ': themeWebSite === WebSite.Armadillo && fullMode === MODE.OFF,
        'xl:left-[30%] ': themeWebSite === WebSite.Armadillo && fullMode === MODE.ON,
        '2xl:left-[46.5rem]': themeWebSite === WebSite.Cvi,
        'xl:left-[51%] ': themeWebSite === WebSite.Cvi && fullMode === MODE.OFF,
        'xl:left-[47.7%] ': themeWebSite === WebSite.Cvi && fullMode === MODE.ON,
      })}
    >
      <ul className="flex xl:flex-col xl:gap-10 flex-row  xl:py-6 py-4 xl:z-[9999999] xl:fixed xl:top-[5rem]  bg-custom-nav-bg ">
        {socialLink.map(({ title, url }) => {
          return (
            <li
              key={title}
              className={classNames({
                'flex items-center  xl:pr-7 xl:pl-6 lg:px-5  ': true,
                'xl:pl-[1.2rem] ': title === 'defiPulse',
                'xl:pl-[1.4rem] ': title === 'youtube',
                'xl:pl-5': title === 'governance' || title === 'github',
              })}
            >
              <a
                href={url}
                id={title}
                onMouseOver={event => handleHover(event)}
                onMouseOut={() => resetHoverAndClick()}
                onMouseDown={event => handleClick(event)}
                onMouseUp={() => resetHoverAndClick()}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`${themeWebSite} ${classNames({
                  'flex flex-row items-center  mx-4 xl:mx-0  text-custom-community': true,
                  'text-custom-community-hover': titleHover === title,
                  'text-custom-community-click': titleClick === title,
                  'gap-2': themeWebSite === WebSite.Armadillo,
                  'gap-2.5 items-center': themeWebSite === WebSite.Cvi,
                  'gap-0.5': title === 'defiPulse',
                  'gap-[0.45rem]': title === 'governance' || title === 'github',
                  // 'mb-auto': title === 'github',
                })}`}
              >
                <GetSvg
                  svgName={title}
                  className={`${themeWebSite} ${classNames({
                    'fill-custom-community ': true,
                    'fill-custom-community-hover': titleHover === title,
                    'fill-custom-community-click': titleClick === title,
                    'w-[1.5rem]': title === 'youtube',
                    'w-6': title === 'github',
                  })}`}
                />
                <span
                  className={classNames({
                    'hidden xl:flex text-lg text-left w-fit float-right xl:text-center ': true,
                    capitalize: title !== 'defiPulse',
                  })}
                >
                  {title === 'defiPulse' ? 'Defi pulse' : title}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Community
