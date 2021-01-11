import React from 'react'

import { LOAD_GROUPS } from '../graphql'
import useCreateGroupDialog from '../hooks/useCreateGroupDialog'
import useProvider from '../hooks/useProvider'

import Entities from './Entities'

export default function Groups() {
  const {
    capabilities: { canSearchGroups }
  } = useProvider()

  return (
    <Entities
      entityName="Group"
      entitiesName="Groups"
      entitiesKey="groups"
      query={LOAD_GROUPS}
      canSearch={canSearchGroups}
      useCreateEntityDialog={useCreateGroupDialog}
    />
  )
}
