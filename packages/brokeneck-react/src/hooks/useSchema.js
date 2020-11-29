import { useContext } from 'react'

import SchemaContext from '../components/SchemaContext'

export default function useSchema(typeName) {
  const schema = useContext(SchemaContext)

  return schema.types.find(type => type.name === typeName)
}
