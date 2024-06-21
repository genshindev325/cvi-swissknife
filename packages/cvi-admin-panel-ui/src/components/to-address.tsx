import { Link } from 'react-router-dom'
import { ChainId } from '../../../lw-sdk/src'
import { useAppSelector } from '../redux'
import { useStrictCurrentPath } from '../hooks/use-strict-current-path'
import { useMemo } from 'react'
import useInversify from '../hooks/use-inversify'
import { getAddressGroupAndName } from '@coti-cvi/lw-sdk'

export function ToAddress({
  address,
  minimize,
  disableLink,
  linkToXScan,
  hideAddressType,
}: {
  address?: string
  minimize?: boolean
  disableLink?: boolean
  linkToXScan?: boolean
  hideAddressType?: boolean
}) {
  const chainId = useAppSelector(state => state.chainId)
  const currentTabPath = useStrictCurrentPath()
  const { cviContractsInversifyService } = useInversify()

  const addressName = useMemo(
    () =>
      address &&
      cviContractsInversifyService &&
      getAddressGroupAndName(address, cviContractsInversifyService).addressName,
    [address, cviContractsInversifyService],
  )

  const xScanLink = chainId === ChainId.ArbitrumMainnet ? `https://debank.com/profile/${address}` : undefined

  if (!address) {
    return <span>Loading Address Info...</span>
  }

  const body = (() => {
    if (address?.toLowerCase() === '0x0000000000000000000000000000000000000000') {
      return <span>0X000</span>
    }

    const addressNameComponent = !hideAddressType && addressName && (
      <span className="ml-1">
        <b>{addressName}</b>
      </span>
    )

    if (addressNameComponent) {
      return minimize ? (
        <span>
          <span>{addressNameComponent}</span> <span>({address.slice(0, 5)})</span>
        </span>
      ) : (
        <span>
          <span>{addressNameComponent}</span> <span>({address})</span>
        </span>
      )
    }

    return (
      <span>
        <span>{minimize ? address.slice(0, 5) : address}</span>
        {addressNameComponent}
      </span>
    )
  })()

  if (disableLink) {
    return body
  }

  if (linkToXScan && xScanLink) {
    return (
      <a href={xScanLink} target="_blank" rel="noopener noreferrer">
        {body}
      </a>
    )
  }

  return <Link to={`${currentTabPath}/${address}`}>{body}</Link>
}
