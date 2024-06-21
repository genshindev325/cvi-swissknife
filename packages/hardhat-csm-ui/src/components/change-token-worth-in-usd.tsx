import type { TokenName } from '@coti-cvi/lw-sdk'
import { useEffect, useState } from 'react'

export function ChangeTokenWorthInUsd({
  tokenName,
  setTokenPriceUsd,
  getTokenPriceUsd,
}: {
  tokenName: TokenName
  getTokenPriceUsd: () => Promise<number>
  setTokenPriceUsd: (newTokenPriceUsd: number) => Promise<void>
}) {
  const [newTokenWorthUsdInput, setNewTokenWorthUsdInput] = useState<string>('')
  const [tokenWorthUsdInput, setTokenWorthUsdInput] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const get = async () => setTokenWorthUsdInput(await getTokenPriceUsd())
    const id = setInterval(get, 30_000)
    get()
    return () => clearInterval(id)
  })

  return (
    <div>
      {tokenWorthUsdInput === undefined ? (
        <span>{tokenName}: ....</span>
      ) : (
        <span>
          {tokenName}: {tokenWorthUsdInput}$ - New Value (USD):{' '}
          <input
            type="text"
            disabled={isLoading}
            value={newTokenWorthUsdInput}
            onChange={e => setNewTokenWorthUsdInput(e.target.value)}
          />{' '}
          <button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true)
              try {
                await setTokenPriceUsd(Number(newTokenWorthUsdInput))
                setTokenWorthUsdInput(await getTokenPriceUsd())
              } catch (e) {
                console.error(e)
              } finally {
                setIsLoading(false)
              }
            }}
          >
            Change
          </button>
        </span>
      )}
    </div>
  )
}
