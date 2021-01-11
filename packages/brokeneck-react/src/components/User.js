import React from 'react'
import T from 'prop-types'
import { Box, Button, Chip, Typography } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation } from 'graphql-hooks'

import useAddUserToGroupDialog from '../hooks/useAddUserToGroupDialog'
import { DELETE_USER, LOAD_USER, REMOVE_USER_FROM_GROUP } from '../graphql'
import useFields from '../hooks/useFields'
import useConfirmDialog from '../hooks/useConfirmDialog'

import Entity from './Entity'

export default function User({ userId }) {
  const history = useHistory()
  const userFields = useFields('User')
  const groupFields = useFields('Group')

  const { data, loading, refetch: loadUser } = useQuery(
    LOAD_USER(userFields.all, groupFields.all),
    {
      variables: { id: userId }
    }
  )

  const [addUserToGroupDialog, openAddUserToGroup] = useAddUserToGroupDialog(
    userId,
    loadUser
  )
  const [confirmDeleteDialog, confirmDelete] = useConfirmDialog({
    title: 'Delete user',
    text: 'Are you sure you want to delete this user?',
    action: 'Confirm'
  })
  const [
    confirmRemoveFromGroupDialog,
    confirmRemoveFromGroup
  ] = useConfirmDialog({
    title: 'Remove from group',
    text: 'Are you sure you want to remove user from group?',
    action: 'Confirm'
  })
  const [removeUserFromGroup] = useMutation(REMOVE_USER_FROM_GROUP)
  const [deleteUser] = useMutation(DELETE_USER)

  async function handleRemoveUserFromGroup(groupId) {
    if (!(await confirmRemoveFromGroup())) {
      return
    }

    await removeUserFromGroup({
      variables: {
        input: {
          userId,
          groupId
        }
      }
    })

    loadUser()
  }

  async function handleDeleteUser() {
    if (!(await confirmDelete())) {
      return
    }

    await deleteUser({
      variables: {
        input: {
          id: userId
        }
      }
    })

    history.goBack()
  }

  return (
    <Entity
      name="User"
      pluralName="Users"
      description={data?.user[userFields.description]}
      entityData={data?.user}
      loading={loading}
      entityMutationButtons={
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={openAddUserToGroup}
          >
            Add to group
          </Button>
          <Button variant="outlined" onClick={handleDeleteUser}>
            Delete user
          </Button>
        </>
      }
      SecondaryComponent={({ classes }) => (
        <>
          <Typography variant="h6" gutterBottom>
            Groups
          </Typography>
          <Box className={classes.spacing}>
            {data.user.groups?.map(group => (
              <Chip
                key={group[groupFields.id]}
                label={group[groupFields.description]}
                onDelete={() =>
                  handleRemoveUserFromGroup(group[groupFields.id])
                }
                color="primary"
              ></Chip>
            ))}
          </Box>
        </>
      )}
    >
      {addUserToGroupDialog}
      {confirmDeleteDialog}
      {confirmRemoveFromGroupDialog}
    </Entity>
  )
}

User.propTypes = {
  userId: T.string.isRequired
}
