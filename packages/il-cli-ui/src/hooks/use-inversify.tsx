import { useContext } from 'react'
import { inversifyContext } from '../context/inversify-context'

export default function useInversify() {
  const context = useContext(inversifyContext)

  if (context === undefined) {
    throw new Error('Please, use an inversifyService hook with an inversifyServiceProvider component')
  }

  return context
}
