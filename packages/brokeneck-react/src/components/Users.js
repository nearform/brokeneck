import React from 'react'

import { LOAD_USERS } from '../graphql'
import useCreateUserDialog from '../hooks/useCreateUserDialog'

import Entities from './Entities'

export default function Users() {
  return (
    <Entities
      entityName="User"
      entitiesName="Users"
      entitiesKey="users"
      query={LOAD_USERS}
      useCreateEntityDialog={useCreateUserDialog}
    />
  )
}
