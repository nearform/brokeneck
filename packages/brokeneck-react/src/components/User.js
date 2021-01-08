import React from 'react'
import T from 'prop-types'
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Link,
  makeStyles,
  Typography
} from '@material-ui/core'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from 'graphql-hooks'

import useEditUserDialog from '../hooks/useEditUserDialog'
import useAddUserToGroupDialog from '../hooks/useAddUserToGroupDialog'
import {
  DELETE_USER,
  LOAD_USER,
  EDIT_USER,
  REMOVE_USER_FROM_GROUP
} from '../graphql'
import useFields from '../hooks/useFields'
import useConfirmDialog from '../hooks/useConfirmDialog'

import Square from './Square'
import EntityFields from './EntityFields'

const useStyles = makeStyles(theme => ({
  spacing: {
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}))

export default function User({ userId }) {
  const history = useHistory()
  const classes = useStyles()
  const userFields = useFields('User')
  const groupFields = useFields('Group')

  const { data, loading, refetch: loadUser } = useQuery(
    LOAD_USER(userFields.all, groupFields.all),
    {
      variables: { id: userId }
    }
  )

  const [editUserDialog, openUserEdit] = useEditUserDialog(
    data !== undefined ? data : {},
    loadUser
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
  const [editUser] = useMutation(EDIT_USER(userFields.all))

  async function handleEditUser(fields) {
    await editUser({
      variables: {
        id: userId,
        input: {
          ...fields
        }
      }
    })
  }

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

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      {editUserDialog}
      {addUserToGroupDialog}
      {confirmDeleteDialog}
      {confirmRemoveFromGroupDialog}
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Chip
            label={
              <Typography>
                <Link component={RouterLink} color="inherit" to=".">
                  Users
                </Link>
              </Typography>
            }
          ></Chip>
          <Chip
            label={
              <Typography color="textPrimary">
                {data.user[userFields.description]}
              </Typography>
            }
          ></Chip>
        </Breadcrumbs>
      </Box>
      <Box mb={3} className={classes.spacing}>
        <Button
          variant="contained"
          color="primary"
          onClick={openAddUserToGroup}
        >
          Add to group
        </Button>
        <Button variant="contained" color="primary" onClick={openUserEdit}>
          Edit user
        </Button>
        <Button variant="outlined" onClick={handleDeleteUser}>
          Delete user
        </Button>
      </Box>
      <Square mb={3}>
        <Typography variant="h6">User</Typography>
        <EntityFields
          typeName="User"
          data={data.user}
          editHandler={handleEditUser}
        />
      </Square>
      <Square mb={3}>
        <Typography variant="h6" gutterBottom>
          Groups
        </Typography>
        <Box className={classes.spacing}>
          {data.user.groups?.map(group => (
            <Chip
              key={group[groupFields.id]}
              label={group[groupFields.description]}
              onDelete={() => handleRemoveUserFromGroup(group[groupFields.id])}
              color="primary"
            ></Chip>
          ))}
        </Box>
      </Square>
    </>
  )
}

User.propTypes = {
  userId: T.string.isRequired
}
