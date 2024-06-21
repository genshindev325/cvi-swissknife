import classNames from 'classnames'
import type { FC } from 'react'
import React from 'react'

type ArticleType = {
  backgroundImage: string
  hrefLink: string
  title: string
  summary: string
  avatar: string
  autorName: string
  publishDay: string
  className?: string
}

const ArticleCard: FC<ArticleType> = ({
  backgroundImage,
  hrefLink,
  title,
  summary,
  avatar,
  autorName,
  publishDay,
  className,
}) => {
  return (
    <a
      className={classNames({
        'break-inside mb-2.5  flex flex-row hover:bg-white hover:bg-opacity-[0.98] bg-white w-[18.75rem] border border-black border-solid border-opacity-20 rounded-xl ':
          true,
        [className ?? '']: !!className,
      })}
      href={hrefLink}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <span className="flex flex-row gap-2">
        <img className="rounded-tl-xl rounded-bl-xl w-1/3" src={backgroundImage} alt="" />
        <span className="flex flex-col gap-1 w-2/3 p-1">
          <p className="text-sm text-black">{title}</p>
          <p className="text-xs text-gray-400">{summary}... </p>
          <b className="text-sm text-[#246fd6] ml-auto pr-2">Read more...</b>
        </span>
      </span>
    </a>

    // <span className="flex flex-col break-inside mb-3 justify-center items-center text-base w-[300px]  bg-white  hover:bg-[#ebf0f322] border border-black border-solid border-opacity-20  rounded-xl">
    //   <a className="w-300 flex flex-col gap-1" href={hrefLink} target="_blank" rel="noopener noreferrer nofollow">
    //     <img className="rounded-tl-xl rounded-tr-xl" src={backgroundImage} alt="" />
    //     <span className="flex flex-col gap-4 px-4">
    //       <span className="flex flex-col gap-1">
    //         <p className="">{title}</p>
    //         <p className="text-sm text-gray-400">{summary}... </p>
    //       </span>
    //       <span className="flex flex-row gap-2">
    //         <img className="rounded-[100%] w-10" src={avatar} alt="" />
    //         <span className="flex flex-col text-sm">
    //           <span>{autorName}</span>
    //           <span className=" text-gray-400">{publishDay}</span>
    //         </span>
    //       </span>

    //       <b className="text-sm text-[#246fd6] px-4 pb-4 ml-auto">Read more...</b>
    //     </span>
    //   </a>
    // </span>
  )
}

export default ArticleCard
