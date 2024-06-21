import useLocalStorageState from 'use-local-storage-state'

const localStorageKeys = {
  isDebugMode: true,
}

const resetCache = 2 // use this to reset the cache for all of the users

export const useLocalStorage = <Key extends keyof typeof localStorageKeys>(key: Key) => {
  return useLocalStorageState(`il-admin-panel-ui::reset-cache-${resetCache}::${key}`, {
    defaultValue: localStorageKeys[key],
  })
}
