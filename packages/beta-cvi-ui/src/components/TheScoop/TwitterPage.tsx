import classNames from 'classnames'
import React from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import Spinner from '../Spinner/Spinner'
export const placeholderFunc = (height?: string) => {
  return (
    <span
      className={classNames({
        'flex w-full  items-center break-inside border border-gray-400 border-solid border-opacity-20  mb-2.5 rounded-xl':
          true,
        'h-100': !height,
        [height ?? '']: !!height,
      })}
    >
      <Spinner className="m-auto w-8 h-8 border-2 border-[#246fd6] border-solid" />
    </span>
  )
}
const TwitterPage = () => {
  return (
    <div className="h-[37rem] lg:w-[40rem] overflow-y-scroll flex items-center">
      <div className=" mt-auto masonry-modal sm:masonry-modal-sm md:masonry-modal-md lg:masonry-modal-lg ">
        <span className="  break-inside  h-fit  ">
          <TwitterTweetEmbed tweetId="1592866198005633025" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
        <span className=" break-inside   h-fit  ">
          <TwitterTweetEmbed tweetId="1609560167942868993" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
        <span className="  break-inside  h-fit ">
          <TwitterTweetEmbed tweetId="1613504066482753536" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
        <span className=" break-inside h-fit  ">
          <TwitterTweetEmbed tweetId="1617923681166004225" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
        <span className=" break-inside  h-fit  ">
          <TwitterTweetEmbed tweetId="1617849812124307459" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
        <span className="   break-inside     h-fit  ">
          <TwitterTweetEmbed tweetId="1607320888105644042" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
        <span className="  break-inside  h-fit  ">
          <TwitterTweetEmbed tweetId="1608066498056310786" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
        <span className="  break-inside  h-fit  ">
          <TwitterTweetEmbed tweetId="1613870778365382657" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>

        <span className="  break-inside  h-fit  ">
          <TwitterTweetEmbed tweetId="1615712725728137218" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
        <span className="  break-inside  h-fit  ">
          <TwitterTweetEmbed tweetId="1608823291099381765" options={{ width: '300' }} placeholder={placeholderFunc()} />
        </span>
      </div>
    </div>
  )
}

export default TwitterPage
