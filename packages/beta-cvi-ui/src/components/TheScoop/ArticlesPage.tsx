import React from 'react'
import ArticleCard from './ArticleCard'
const ArticlesPage = () => {
  return (
    <>
      <div className="masonry-modal sm:masonry-modal-sm md:masonry-modal-md lg:masonry-modal-lg">
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
        />

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
    </>
  )
}

export default ArticlesPage
