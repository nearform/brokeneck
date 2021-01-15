import React from 'react'
import {
  Button,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import T from 'prop-types'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import useAddUsersToGroupDialog from '../hooks/useAddUsersToGroupDialog'
import {
  DELETE_GROUP,
  EDIT_GROUP,
  LOAD_GROUP,
  REMOVE_USER_FROM_GROUP
} from '../graphql'
import useFields from '../hooks/useFields'
import useConfirmDialog from '../hooks/useConfirmDialog'
import usePagination from '../hooks/usePagination'
import useEditEntityDialog from '../hooks/useEditEntityDialog'
import TYPES from '../types'

import Entity from './Entity'

export default function Group({ groupId }) {
  const history = useHistory()
  const groupFields = useFields(TYPES.Group)
  const userFields = useFields(TYPES.User)

  const {
    pageSize,
    currentToken,
    useUpdateToken,
    useTablePagination
  } = usePagination({ pageSizeOptions: [2, 3, 4] }) // TODO: temp small page sizes for testing

  const { data, loading, refetch: loadGroup } = useQuery(
    LOAD_GROUP(groupFields.all, userFields.all),
    {
      variables: {
        id: groupId,
        pageSize,
        pageNumber: currentToken
      }
    }
  )

  useUpdateToken(data?.group.users.nextPage)

  const tablePagination = useTablePagination(data?.group.users)

  const [addUsersToGroupDialog, openAddUsersToGroup] = useAddUsersToGroupDialog(
    groupId,
    loadGroup
  )
  const [editGroupDialog, openEditGroup] = useEditEntityDialog(
    groupId,
    data?.group,
    loadGroup,
    TYPES.EditGroupInput,
    TYPES.Group,
    EDIT_GROUP
  )
  const [confirmDeleteDialog, confirmDelete] = useConfirmDialog({
    title: 'Delete group',
    text: 'Are you sure you want to delete this group?',
    action: 'Confirm'
  })
  const [confirmRemoveUserDialog, confirmRemoveUser] = useConfirmDialog({
    title: 'Remove user',
    text: 'Are you sure you want to remove user from group?',
    action: 'Confirm'
  })
  const [removeUserFromGroup] = useMutation(REMOVE_USER_FROM_GROUP)
  const [deleteGroup] = useMutation(DELETE_GROUP)

  async function handleRemoveUserFromGroup(userId) {
    if (!(await confirmRemoveUser())) {
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

    loadGroup()
  }

  async function handleDeleteGroup() {
    if (!(await confirmDelete())) {
      return
    }

    await deleteGroup({
      variables: {
        input: {
          id: groupId
        }
      }
    })

    history.goBack()
  }

  return (
    <Entity
      name="Group"
      pluralName="Groups"
      description={data?.group[groupFields.description]}
      entityData={data?.group}
      loading={loading}
      entityMutationButtons={
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={openAddUsersToGroup}
          >
            Add users
          </Button>
          <Button variant="contained" color="secondary" onClick={openEditGroup}>
            Edit group
          </Button>
          <Button variant="outlined" onClick={handleDeleteGroup}>
            Delete group
          </Button>
        </>
      }
      SecondaryComponent={() => (
        <>
          <Typography variant="h6" gutterBottom>
            Users
          </Typography>
          {!data.group.users.data.length ? (
            <Typography>No users</Typography>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{startCase(userFields.description)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.group.users.data?.map(user => (
                      <TableRow key={user[userFields.id]}>
                        <TableCell>
                          <Link
                            color="secondary"
                            component={RouterLink}
                            to={`../users/${user[userFields.id]}`}
                          >
                            <Typography>
                              {user[userFields.description]}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            title="remove user from group"
                            onClick={() =>
                              handleRemoveUserFromGroup(user[userFields.id])
                            }
                          >
                            <Typography>
                              <span role="img" aria-label="remove from group">
                                ❌
                              </span>
                            </Typography>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {tablePagination}
            </>
          )}
        </>
      )}
    >
      {addUsersToGroupDialog}
      {confirmDeleteDialog}
      {confirmRemoveUserDialog}
      {editGroupDialog}
    </Entity>
  )
}

Group.propTypes = {
  groupId: T.string.isRequired
}
