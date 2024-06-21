import { useContext } from 'react'
import { inversifyContext } from '../inversify-context'

export default function useInversify() {
  return useContext(inversifyContext)
}
