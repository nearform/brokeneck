import React from 'react'

import { LOAD_GROUPS } from '../graphql'

import Entities from './Entities'

export default function Groups() {
  return (
    <Entities
      entityName="Group"
      entitiesName="Groups"
      entitiesKey="groups"
      query={LOAD_GROUPS}
    />
  )
}
