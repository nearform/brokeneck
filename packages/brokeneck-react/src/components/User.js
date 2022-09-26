import { Box, Button, Chip, Typography } from '@material-ui/core'
import { useMutation, useQuery } from 'graphql-hooks'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  DELETE_USER,
  EDIT_USER,
  LOAD_USER,
  REMOVE_USER_FROM_GROUP
} from '../graphql'
import useAddUserToGroupDialog from '../hooks/useAddUserToGroupDialog'
import useConfirmDialog from '../hooks/useConfirmDialog'
import useEditEntityDialog from '../hooks/useEditEntityDialog'
import useFields from '../hooks/useFields'
import TYPES from '../types'

import Entity from './Entity'

export default function User() {
  const params = useParams()
  const navigate = useNavigate()
  const userFields = useFields(TYPES.User)
  const groupFields = useFields(TYPES.Group)

  const { userId } = params

  const {
    data,
    loading,
    refetch: loadUser
  } = useQuery(LOAD_USER(userFields.all, groupFields.all), {
    variables: { id: userId }
  })

  const [addUserToGroupDialog, openAddUserToGroup] = useAddUserToGroupDialog(
    userId,
    loadUser
  )
  const [editUserDialog, openEditUser] = useEditEntityDialog(
    userId,
    data?.user,
    loadUser,
    TYPES.EditUserInput,
    TYPES.User,
    EDIT_USER
  )
  const [confirmDeleteDialog, confirmDelete] = useConfirmDialog({
    title: 'Delete user',
    text: 'Are you sure you want to delete this user?',
    action: 'Confirm'
  })
  const [confirmRemoveFromGroupDialog, confirmRemoveFromGroup] =
    useConfirmDialog({
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

    navigate(-1)
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
          <Button variant="contained" color="secondary" onClick={openEditUser}>
            Edit user
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
            {!data.user.groups.length && <Typography>No groups</Typography>}
            {data.user.groups?.map(group => (
              <Chip
                key={group[groupFields.id]}
                label={group[groupFields.description]}
                onDelete={() =>
                  handleRemoveUserFromGroup(group[groupFields.id])
                }
                color="primary"
                data-testid="user-group-chip"
              ></Chip>
            ))}
          </Box>
        </>
      )}
    >
      {addUserToGroupDialog}
      {confirmDeleteDialog}
      {confirmRemoveFromGroupDialog}
      {editUserDialog}
    </Entity>
  )
}
