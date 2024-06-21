import { useContext } from 'react'
import { inversifyContext } from '../context/inversify-context'

export default function useInversify() {
  return useContext(inversifyContext)
}
