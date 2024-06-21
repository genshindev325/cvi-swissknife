import { useContext } from 'react'
import { routerContext } from './Router'

export const useRouter = () => {
  return useContext(routerContext)
}
