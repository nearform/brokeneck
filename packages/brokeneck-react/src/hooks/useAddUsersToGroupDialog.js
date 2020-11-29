import React from 'react'
import { useQuery, useMutation } from 'graphql-hooks'
import { CircularProgress, MenuItem } from '@material-ui/core'

import { ADD_USER_TO_GROUP, LOAD_USERS } from '../graphql'
import GraphQLError from '../GraphQLError'

import useDialog from './useDialog'
import useFields from './useFields'

export default function useAddUsersToGroupDialog(groupId, onConfirm) {
  const userFields = useFields('User')
  const { data, loading } = useQuery(LOAD_USERS(userFields.all))
  const [addUserToGroup] = useMutation(ADD_USER_TO_GROUP)

  const handleConfirm = async input => {
    const { error } = await addUserToGroup({
      variables: {
        input: { userId: input[userFields.id], groupId },
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
    title: `Add users to group ${groupId}`,
    text: 'Use this form to add users to a group',
    action: 'Add to group',
    fields: [
      {
        name: userFields.id,
        label: userFields.description,
        select: true,
        required: true,
        children: loading ? (
          <CircularProgress />
        ) : (
          data.users.map(user => (
            <MenuItem key={user[userFields.id]} value={user[userFields.id]}>
              {user[userFields.description]}
            </MenuItem>
          ))
        )
      }
    ]
  })
}
