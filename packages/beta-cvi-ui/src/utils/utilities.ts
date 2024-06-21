import type { InversifyAllMethodsName, RequestStatus, SupportedDecimals } from '@coti-cvi/lw-sdk'
import type { iNotification } from 'react-notifications-component'
import { Store } from 'react-notifications-component'

export function openInNewTab(url: string, target = '_blank') {
  // @ts-ignore
  window.open(url, target).focus()
}

export function ellipseAddress(address = '', width = 10): string {
  if (!address) {
    return ''
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`
}

export function findLoadingStatus(statusState: RequestStatus[]) {
  return (
    statusState.find(s => s === 'pending') ||
    statusState.find(s => s === 'rejected') ||
    (statusState.find(s => s === 'resolved') as RequestStatus)
  )
}

export function displayNotification({
  id,
  title,
  message,
  type,
  content,
}: {
  id: string | InversifyAllMethodsName
  type: iNotification['type']
  title?: iNotification['title']
  message?: iNotification['message']
  content?: iNotification['content']
}) {
  // we may use the notification id for analytics
  Store.addNotification({
    id,
    title,
    message,
    type,
    insert: 'bottom',
    container: 'bottom-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 8000,
      onScreen: false,
      showIcon: true,
      pauseOnHover: true,
    },

    content,
  })
}

export const getInputAmount = (numberPrettified: string, decimals: SupportedDecimals) => {
  if (numberPrettified === '') {
    return ''
  }
  const amountSplitted = numberPrettified.split('.')
  const newValue = amountSplitted[0]
    .replace(/^0\d$/, '0')
    .replace(/\D*/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const dotsPart = amountSplitted?.length > 1 ? `.${amountSplitted[1].replace(/[^.\d]/g, '').slice(0, decimals)}` : ''
  const hasOnlyDot = amountSplitted[0] === '' && dotsPart === '.' ? '0' : ''

  return `${hasOnlyDot}${newValue}${dotsPart}`
}

export const isEmptyAmount = (amount: string) => {
  const isEmptyAmountRegex = /^($|0|0.|0.0+$|\s)$/
  return isEmptyAmountRegex.test(amount)
}
