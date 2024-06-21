import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { CHAIN_IDS_INFO, IL_SUPPORTED_CHAIN_IDS } from '@coti-cvi/lw-sdk'
import { Combobox } from 'react-widgets'
import { actions, useAppDispatch, useAppSelector } from '../redux'

type Props = {}

export const ChangeChainId: FC<Props> = () => {
  const dispatch = useAppDispatch()
  const chainId = useAppSelector(state => state.state.chainId)

  const [chainTerm, setChainTerm] = useState<string>(CHAIN_IDS_INFO[chainId].hardhatConfigNetworkName)

  useEffect(() => {
    const _chainId = IL_SUPPORTED_CHAIN_IDS.find(c => CHAIN_IDS_INFO[c].hardhatConfigNetworkName === chainTerm)
    if (_chainId) {
      dispatch(actions.setChainId(_chainId))
    }
  }, [chainTerm, dispatch])

  const data = Object.values(IL_SUPPORTED_CHAIN_IDS).map(r => CHAIN_IDS_INFO[r].hardhatConfigNetworkName)

  return (
    <div>
      Choose environment:
      <Combobox
        key={Date.now()}
        style={{
          width: '300px',
        }}
        data={data}
        value={chainTerm}
        onChange={value => setChainTerm(value)}
      />
    </div>
  )
}
