import React from 'react'
import { useQuery, useMutation } from 'graphql-hooks'
import { CircularProgress, MenuItem } from '@material-ui/core'
import startCase from 'lodash.startcase'

import { ADD_USER_TO_GROUP, LOAD_GROUPS } from '../graphql'
import GraphQLError from '../GraphQLError'

import useDialog from './useDialog'
import useFields from './useFields'

export default function useAddUserToGroupDialog(userId, onConfirm) {
  const groupFields = useFields('Group')
  const { data, loading } = useQuery(LOAD_GROUPS(groupFields.all))
  const [addUserToGroup] = useMutation(ADD_USER_TO_GROUP)

  const handleConfirm = async input => {
    const { error } = await addUserToGroup({
      variables: {
        input: { groupId: input[groupFields.id], userId },
        skipErrorHandling: true
      }
    })

    if (error) {
      throw new GraphQLError(error)
    }

    onConfirm()
  }

  return useDialog({
    onConfirm: handleConfirm,
    title: `Add user ${userId} to group`,
    text: 'Use this form to add user to a group',
    action: 'Add to group',
    fields: [
      {
        name: groupFields.id,
        label: startCase(groupFields.description),
        select: true,
        ...groupFields.metadata[groupFields.id],
        children: loading ? (
          <CircularProgress />
        ) : (
          data.groups.data.map(group => (
            <MenuItem key={group[groupFields.id]} value={group[groupFields.id]}>
              {group[groupFields.description]}
            </MenuItem>
          ))
        )
      }
    ]
  })
}
