import React, { useCallback, useState } from 'react'
import CommonModal from '../Modals/CommonModal'
import ArticlesPage from './ArticlesPage'
import SocialCollage from './SocialCollage'
import TwitterPage from './TwitterPage'
import YoutubePage from './YoutubePage'

const TheScoopManager = () => {
  const [chooseSocial, setChooseSocial] = useState<'youtube' | 'twitter' | 'articles' | undefined>()
  const [showModal, setShowModal] = useState(false)

  const handleClickScroll = useCallback((section: 'youtube' | 'twitter' | 'articles') => {
    setChooseSocial(section)
    setShowModal(true)
  }, [])

  return (
    <div className="flex flex-col xl:flex-row justify-center w-[94.5rem] relative ">
      <div className="xl:relative sticky xl:mr-auto  xl:-top-16 top-[4.9rem] ">
        <span className="flex flex-row xl:flex-col justify-around xl:justify-start   bg-custom-win-bg xl:fixed">
          <button
            onClick={() => handleClickScroll('twitter')}
            className="flex justify-center  mb-3  p-4  items-center sm:h-44  cursor-pointer"
          >
            <span className="flex flex-col">
              <span className="text-lg stiny:text-3xl text-[#2d9bf0]">Twitter</span>
              <span className="text-xs stiny:text-md text-gray-500  stinyborder-b">Show all twitts</span>
            </span>
          </button>
          <button
            onClick={() => handleClickScroll('articles')}
            className="flex justify-center  mb-3  p-4  items-center sm:h-44 cursor-pointer "
          >
            <span className="flex flex-col">
              <span className="text-lg stiny:text-3xl m-auto  text-white">Articles</span>
              <span className="text-xs stiny:text-md text-gray-500  stinyborder-b">Show all articles</span>
            </span>
          </button>
          <button
            onClick={() => handleClickScroll('youtube')}
            className=" flex justify-center  mb-3  p-4    items-center  sm:h-44 cursor-pointer "
          >
            <span className="flex flex-col">
              <span className="text-lg stiny:text-3xl  text-[#fa0f00]">Youtube</span>
              <span className="text-xs stiny:text-md text-gray-500  stinyborder-b">Show all videos</span>
            </span>
          </button>
        </span>
      </div>
      <div className="xl:w-11/12 flex flex-row justify-center items-center ">
        <SocialCollage />
        <CommonModal type="connectWalletModal" showModal={showModal} setShowModal={setShowModal}>
          {chooseSocial === 'youtube' && <YoutubePage />}
          {chooseSocial === 'twitter' && <TwitterPage />}
          {chooseSocial === 'articles' && <ArticlesPage />}
        </CommonModal>
      </div>
    </div>
  )
}

export default TheScoopManager
