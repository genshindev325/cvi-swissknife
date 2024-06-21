import { useEffect, useState } from 'react'
import type { Block } from '@coti-cvi/lw-sdk'
import type { InitInversifyReturnType } from '../init-inversify'
import usePromise from 'react-use-promise'

export function Impersonate({
  container,
  latestBlock,
  isLoadingImpersonate,
  setIsLoadingImpersonate,
}: {
  isLoadingImpersonate: boolean
  setIsLoadingImpersonate: (IsLoadingImpersonate: boolean) => void
  container?: InitInversifyReturnType
  latestBlock?: Block
}) {
  const [account, setAccount] = useState<string>('')

  const canImpersonate = latestBlock && account && container && !isLoadingImpersonate

  useEffect(() => {
    if (!container) {
      setIsLoadingImpersonate(false)
      setAccount('')
    }
  }, [container, setIsLoadingImpersonate])

  const [hardhatImpersonateAccountInversifyService] = usePromise(
    async () => container?.getAsync('HardhatImpersonateAccountInversifyService'),
    [container],
  )

  return (
    <div>
      <div>
        Impersonate Account:&nbsp;
        <input
          style={{ width: '350px' }}
          placeholder="Add the public address"
          disabled={isLoadingImpersonate}
          value={account}
          onChange={e => setAccount(e.target.value)}
        />
      </div>
      <div style={{ fontSize: '12px' }}>* You will use it the new UI to impersonate account (Not supported yet)</div>
      <br />
      {isLoadingImpersonate && (
        <div>
          <br />
          Impersonating...
        </div>
      )}
      <button
        disabled={!canImpersonate}
        onClick={async () => {
          if (hardhatImpersonateAccountInversifyService) {
            setIsLoadingImpersonate(true)
            await hardhatImpersonateAccountInversifyService.impersonateAccount(account).finally(() => {
              setAccount('')
              setIsLoadingImpersonate(false)
            })
          }
        }}
      >
        Impersonate
      </button>
    </div>
  )
}
