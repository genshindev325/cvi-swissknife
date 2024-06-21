import { useAppSelector } from '../redux'
import { useLocalStorage } from './use-local-storage-state'

export function useShowRestrictRegionModal() {
  const [showRestrictRegionModal] = useLocalStorage('showRestrictRegionModal')
  const isCurrentIpApproved = useAppSelector(state => state.state.isCurrentIpApproved)

  return isCurrentIpApproved === false || showRestrictRegionModal === true
}
