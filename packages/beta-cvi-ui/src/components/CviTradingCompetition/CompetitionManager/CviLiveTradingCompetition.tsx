import { MODE } from '@coti-cvi/lw-sdk'
import { useLocalStorage } from 'beta-cvi-ui/src/hooks/use-local-storage-state'
import { useAppSelector } from 'beta-cvi-ui/src/redux'
import type { GetSvgProps } from 'beta-cvi-ui/src/utils/GetSvg'
import { GetSvg } from 'beta-cvi-ui/src/utils/GetSvg'
import React from 'react'
import InnerContainer from '../../InnerContainer/InnerContainer'
import TimeAndDateToFetchData from '../../TimeAndDateToFetchData'

import CviTradingTable from '../CviTradingTable'
export const socialLink: { title: GetSvgProps['svgName']; url: string }[] = [
  {
    title: 'twitter',
    url: 'https://twitter.com/official_cvi',
  },
  { title: 'telegram', url: 'https://t.me/cviofficial' },
  {
    title: 'discord',
    url: 'https://discord.gg/yuDsy7SM2H',
  },
  {
    title: 'medium',
    url: 'https://cviofficial.medium.com',
  },
]

export const CommunityBanner = () => {
  return (
    <InnerContainer className="bg-dark-300 flex flex-row gap-4  text-center  w-full m-auto">
      <span className="flex flex-col gap-4 items-center justify-center  w-full">
        <p>Stay up to date for the next trading competition ✨</p>
        follow us on our social channels:
        <span className="flex  flex-row  ">
          {socialLink.map(({ title, url }) => {
            return (
              <a
                key={title}
                href={url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex flex-row items-center gap-2.5  mx-4   text-custom-community"
              >
                <GetSvg
                  svgName={title}
                  className="fill-custom-community hover:fill-custom-community-hover active:fill-custom-community-click"
                />
              </a>
            )
          })}
        </span>
      </span>
    </InnerContainer>
  )
}

const CviLiveTradingCompetition = () => {
  const [fullMode] = useLocalStorage('fullMode')
  const liveTrading = useAppSelector(state => state.state.cvi.liveTrading)
  // NEED TO DO NEW EFFECT
  return (
    <div className=" flex flex-col gap-4  text-white ">
      <CommunityBanner />
      {fullMode === MODE.ON && <TimeAndDateToFetchData />}
      <CviTradingTable type="liveLeaderboard" tradingData={liveTrading} />
    </div>
  )
}

export default CviLiveTradingCompetition
