import type { FC } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import React from 'react'
import type { NotificationContent, NotificationTitleMessage, NOTIFICATION_TYPE } from 'react-notifications-component'
import { Store } from 'react-notifications-component'
import { GetSvg } from '../utils/GetSvg'
import PendingNotification from './PendingNotification'
import classNames from 'classnames'
import { useAppSelector } from '../redux'
type PropsNotification = {
  content?: NotificationContent
  id?: string
  message?: string
  onRemoval?: (id: string, removalFlag: string) => void
  title?: NotificationTitleMessage
  type?: NOTIFICATION_TYPE
}

type Props = {
  id: string
  notificationConfig: PropsNotification
}

const CustomNotification: FC<Props> = props => {
  const themeWeb = useAppSelector(({ state }) => state.themeWeb)
  const [txHash, setTxHash] = useState('')

  useEffect(() => {
    if (props.notificationConfig.title === 'completed') {
      setTxHash(props.id)
      Store.removeNotification(`pending-${props.id}`)
    }
  }, [props.id, props.notificationConfig.title])

  useEffect(() => {
    if (props.id !== undefined) {
      if (props.id.includes('-')) {
        const tx = props.id.split('-')
        setTxHash(tx[1])
      }
    }
  }, [props.id])

  const chooseIcon = (title: NotificationTitleMessage) => {
    switch (title) {
      case 'pending':
        return <PendingNotification />
      case 'completed':
        return <GetSvg svgName="completeNote" />
      case 'cancelled':
        return <GetSvg svgName="failedNote" />
      case 'failed':
        return <GetSvg svgName="failedNote" />
    }
  }

  const chooseLink = (title: NotificationTitleMessage) => {
    const MetamaskData = { link: 'https://metamask.io/', text: 'Install MetaMask' }
    const CoinbaseData = { link: 'https://www.coinbase.com/wallet', text: 'Install Coinbase' }
    switch (title) {
      case 'metamask':
        return MetamaskData
      case 'coinbase':
        return CoinbaseData
      default:
        return { link: `https://arbiscan.io/tx/${txHash}`, text: 'View Details' }
    }
  }

  const notificationLink = () => {
    const data = chooseLink(props.notificationConfig.title)
    const href = data.link
    const text = data.text

    return (
      <span>
        <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="a-link-custom-notification-style">
          {text}
        </a>
        {props.id === 'installProvider' && <span> to start using {themeWeb}.</span>}
      </span>
    )
  }

  const toCapitalizeFirstWord = (message: string) => message.charAt(0).toUpperCase() + message.slice(1)

  return (
    <div
      className={classNames({
        'flex flex-row justify-between w-full': true,
      })}
    >
      <span className="flex flex-row gap-2 items-center">
        <span className="mb-auto">{chooseIcon(props.notificationConfig.title)}</span>
        <span className="flex flex-col gap-2">
          <span>{props.notificationConfig.message && toCapitalizeFirstWord(props.notificationConfig.message)}</span>
          {props.notificationConfig.title !== 'failed' && notificationLink()}
        </span>
      </span>
      <button
        className=" mb-auto"
        onClick={() => props.notificationConfig.onRemoval && props.notificationConfig.onRemoval(props.id, props.id)}
      >
        <GetSvg svgName="close" className="w-4 h-4" />
      </button>
    </div>
  )
}

export default CustomNotification
