import useLocalStorageState from 'use-local-storage-state'
import type { CVISupportedChainIds } from '../../../lw-sdk/src'
import { ChainId, CHAIN_IDS_INFO, MODE, WebSite } from '../../../lw-sdk/src'
import { loadWebsite, useAppSelector } from '../redux'

const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

const DEFAULT_IL_CHAIN_ID = ChainId.PolygonMainnet

const DEFAULT_TV_CHAIN_ID = ChainId.ArbitrumMainnet

interface LocalStorageKeys {
  debugMode: boolean
  showIlIntroPopup: boolean
  showCviIntroModal: boolean
  showRestrictRegionModal: boolean
  fullMode: MODE.ON | MODE.OFF
  displaySettings: MODE.ON | MODE.OFF
  defaultChain: typeof CHAIN_IDS_INFO[CVISupportedChainIds]
}

const localStorageKeys: LocalStorageKeys = {
  debugMode: isLocalhost,
  showIlIntroPopup: true,
  showCviIntroModal: true,
  showRestrictRegionModal: true,
  fullMode: isLocalhost ? MODE.ON : MODE.OFF,
  displaySettings: isLocalhost ? MODE.ON : MODE.OFF,
  defaultChain:
    loadWebsite() === WebSite.Cvi ? CHAIN_IDS_INFO[DEFAULT_TV_CHAIN_ID] : CHAIN_IDS_INFO[DEFAULT_IL_CHAIN_ID],
}

export const useLocalStorage = <Key extends keyof typeof localStorageKeys>(key: Key) => {
  const website = useAppSelector(state => state.state.themeWeb)

  return useLocalStorageState(`${website}::${key}`, {
    defaultValue: localStorageKeys[key],
  })
}
