import { useContext } from 'react'
import { inversifyContext } from '../contexts/inversify-context'

export default function useInversify() {
  return useContext(inversifyContext)
}
