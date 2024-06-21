import React from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import ArticleCard from './ArticleCard'
import { placeholderFunc } from './TwitterPage'
import ReactTooltip from 'react-tooltip'

export const globalYoutubeTooltip = (id: string, text: string, place?: 'bottom' | 'right' | 'left' | 'top') => {
  return (
    <ReactTooltip
      id={id}
      place={`${place ? place : 'top'}`}
      effect="solid"
      data-html={true}
      insecure={true}
      multiline={true}
      className="default-react-tooltip-style "
      delayHide={0}
    >
      {text}
    </ReactTooltip>
  )
}

const SocialCollage = () => {
  return (
    <div className="social-collage masonry sm:masonry-sm md:masonry-md lg:masonry-lg">
      <span className="  break-inside  h-fit  ">
        <TwitterTweetEmbed
          tweetId="1592866198005633025"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[582px]')}
        />
      </span>

      <span
        data-tip
        data-for="6TpN9GHMgy4"
        className=" break-inside  flex bg-white hover:bg-white hover:bg-opacity-[0.98]  mb-3  border border-white border-solid    rounded-xl py-2   justify-center "
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
      <span className="  break-inside  h-fit  ">
        <TwitterTweetEmbed
          tweetId="1613504066482753536"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[576px]')}
        />
      </span>
      <ArticleCard
        backgroundImage={
          'https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Feb49fbdc-9d42-4d98-871e-c83d460e9bb5_1086x611.png'
        }
        hrefLink={'https://thebabylonians.substack.com/p/crypto-volatility-index-cvi-how-to'}
        title={'Crypto Volatility Index (CVI) - How to Long/Short Volatility?'}
        summary={"Trading Crypto's Volatility"}
        avatar={
          'https://substackcdn.com/image/fetch/w_64,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Fbb438440-65e3-4134-ad23-67177f2d0529_400x400.jpeg'
        }
        autorName={'TheBabylonians 🌴'}
        publishDay={'Jan 10'}
      />

      <span className=" break-inside h-fit    ">
        <TwitterTweetEmbed
          tweetId="1617923681166004225"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[676px]')}
        />
      </span>

      <span className=" break-inside   h-fit">
        <TwitterTweetEmbed
          tweetId="1609560167942868993"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[643px]')}
        />
      </span>
      <ArticleCard
        backgroundImage={'https://miro.medium.com/max/720/1*K4ykqUcFlFl0DM7w6oe-Vg.webp'}
        hrefLink={
          'https://medium.com/@gbland94/understanding-the-crypto-volatility-index-cvi-how-to-trade-volatility-using-cvol-tokens-5d5517eff03a'
        }
        title={'Understanding The Crypto Volatility Index (CVI):'}
        summary={'How to trade volatility using CVOL tokens'}
        avatar={''}
        autorName={'GregB'}
        publishDay={'Jan 12'}
        className="mt-2.5"
      />
      <span className=" break-inside  h-fit    ">
        <TwitterTweetEmbed
          tweetId="1617849812124307459"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[505px]')}
        />
      </span>
      <span
        data-tip
        data-for="fTGZH887RCs"
        className=" break-inside bg-white hover:bg-white hover:bg-opacity-[0.98]    mb-3  flex  border border-white border-solid  py-2   rounded-xl  justify-center"
      >
        <iframe
          width="280"
          src="https://www.youtube.com/embed/fTGZH887RCs"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={true}
        ></iframe>
      </span>
      {globalYoutubeTooltip('fTGZH887RCs', 'What is CVOL - Volatility Tokens Explained')}

      <span className="  break-inside  h-fit    ">
        <TwitterTweetEmbed
          tweetId="1608066498056310786"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[429px]')}
        />
      </span>
      <span
        data-tip
        data-for="7Op3sFpradM"
        className="break-inside  flex bg-white hover:bg-white hover:bg-opacity-[0.98]   mb-3 border border-white border-solid    rounded-xl py-2   justify-center"
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
      {globalYoutubeTooltip('7Op3sFpradM', 'CVOL - The best way to trade Crypto Volatility')}

      <span className="  break-inside  h-fit    ">
        <TwitterTweetEmbed
          tweetId="1613870778365382657"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[599px]')}
        />
      </span>
      <span
        data-tip
        data-for="HoDwWCJy4Tg"
        className=" break-inside  flex bg-white hover:bg-white hover:bg-opacity-[0.98]  mb-3  border border-white border-solid    rounded-xl py-2   justify-center "
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
      )}

      <span className="   break-inside     h-fit    ">
        <TwitterTweetEmbed
          tweetId="1607320888105644042"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[637px]')}
        />
      </span>

      <span className="  break-inside  h-fit  ">
        <TwitterTweetEmbed
          tweetId="1615712725728137218"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[656px]')}
        />
      </span>
      <span className="  break-inside  h-fit  ">
        <TwitterTweetEmbed
          tweetId="1608823291099381765"
          options={{ width: '300' }}
          placeholder={placeholderFunc('h-[626px]')}
        />
      </span>
      <ArticleCard
        backgroundImage={'https://miro.medium.com/v2/resize:fit:640/format:webp/0*ZrrGGTUZ-MODtECu.jpeg'}
        hrefLink={
          'https://medium.com/coinmonks/crypto-reinnassance-on-arbitrum-new-defi-protocols-are-super-impressive-15051328c718'
        }
        title={'Crypto Reinnassance on Arbitrum:'}
        summary={'New DeFi Protocols are Super Impressive'}
        avatar={'https://francescoglt.medium.com/?source=two_column_layout_sidebar'}
        autorName={'Francesco'}
        publishDay={'Jan 9'}
      />
    </div>
  )
}

export default SocialCollage
