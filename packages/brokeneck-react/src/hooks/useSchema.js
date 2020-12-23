import { useContext } from 'react'

import RootContext from '../components/RootContext'

export default function useSchema(typeName) {
  const { __schema } = useContext(RootContext)

  return __schema.types.find(type => type.name === typeName)
}
