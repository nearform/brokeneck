import { useContext } from 'react'

import RootContext from '../components/RootContext'

export default function useProvider() {
  const { provider } = useContext(RootContext)

  return provider
}
