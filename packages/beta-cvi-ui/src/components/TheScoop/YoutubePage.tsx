import React from 'react'
import { globalYoutubeTooltip } from './SocialCollage'
const YoutubePage = () => {
  return (
    <>
      <div className="masonry-modal sm:masonry-modal-sm md:masonry-modal-md lg:masonry-modal-lg ">
        <span
          data-tip
          data-for="6TpN9GHMgy4"
          className=" break-inside  flex bg-white hover:bg-white hover:bg-opacity-[0.98]  mb-3  border border-black border-solid border-opacity-20   rounded-xl py-2   justify-center "
        >
          <iframe
            width="280"
            // height="250"
            src="https://www.youtube.com/embed/6TpN9GHMgy4"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
          ></iframe>
        </span>
        {globalYoutubeTooltip('6TpN9GHMgy4', 'CVI - The Funnels of Volatility Trading')}
        <span
          data-tip
          data-for="HoDwWCJy4Tg"
          className=" break-inside  flex bg-white hover:bg-white hover:bg-opacity-[0.98]  mb-3  border border-black border-solid border-opacity-20   rounded-xl py-2   justify-center "
        >
          <iframe
            width="280"
            // height="250"
            src="https://www.youtube.com/embed/HoDwWCJy4Tg"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
          ></iframe>
        </span>
        {globalYoutubeTooltip(
          'HoDwWCJy4Tg',
          'Crypto Volatility Index - CVI v3: Theta Vault, AMM, Volatility Tokens and everything in between',
          'bottom',
        )}
        <span
          data-tip
          data-for="fTGZH887RCs"
          className=" break-inside bg-white hover:bg-white hover:bg-opacity-[0.98]    mb-3  flex  border border-black border-solid border-opacity-20 py-2   rounded-xl  justify-center"
        >
          <iframe
            width="280"
            // height="250"
            src="https://www.youtube.com/embed/fTGZH887RCs"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
          ></iframe>
        </span>
        {globalYoutubeTooltip('fTGZH887RCs', 'What is CVOL - Volatility Tokens Explained')}
        <span
          data-tip
          data-for="7Op3sFpradM"
          className="break-inside  flex bg-white hover:bg-white hover:bg-opacity-[0.98]   mb-3 border border-black border-solid border-opacity-20   rounded-xl py-2   justify-center"
        >
          <iframe
            width="280"
            // height="250"
            src="https://www.youtube.com/embed/7Op3sFpradM"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen={true}
          ></iframe>
        </span>
        {globalYoutubeTooltip('7Op3sFpradM', 'CVOL - The best way to trade Crypto Volatility', 'bottom')}
      </div>
    </>
  )
}

export default YoutubePage
