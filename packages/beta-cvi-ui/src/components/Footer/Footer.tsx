import { WebSite } from '@coti-cvi/lw-sdk/src'
import { useAppSelector } from 'beta-cvi-ui/src/redux/hooks'
import classNames from 'classnames'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

type FooterProps = {}

const Footer = (props: FooterProps) => {
  const location = useLocation()
  const themeWebSite = useAppSelector(state => state.state.themeWeb)

  const handleClick = () => {
    if (location.pathname === '/terms') {
      window.scrollTo(0, 0)
    }
  }

  return (
    <div className="flex h-full justify-end items-center m-4 text-white self-stretch flex-1 flex-col gap-4">
      <div className="flex justify-end text-xs text-common-lightGray">
        © {new Date().getFullYear()} all rights reserved to COTI
      </div>
      <div
        className={`${themeWebSite} ${classNames({
          'text-xs text-common-lightGray hover:text-white active:text-custom-300': true,
        })}`}
      >
        <Link className="underline underline-offset-2" to="/terms" onClick={() => handleClick()}>
          Terms of use
        </Link>
      </div>
      {themeWebSite === WebSite.Armadillo && (
        <div className="flex justify-end w-32 ">
          <img alt="Powered by Zapper" src="/power-zap-black-57567bd4e72fd08da569ae4b9b513873.svg" />
        </div>
      )}
    </div>
  )
}

export default Footer
