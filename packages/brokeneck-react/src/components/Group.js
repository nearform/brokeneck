import React from 'react'
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import T from 'prop-types'
import { Link as RouterLink, useHistory } from 'react-router-dom'
import { useQuery, useMutation } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import useAddUsersToGroupDialog from '../hooks/useAddUsersToGroupDialog'
import { DELETE_GROUP, LOAD_GROUP, REMOVE_USER_FROM_GROUP } from '../graphql'
import useFields from '../hooks/useFields'
import useConfirmDialog from '../hooks/useConfirmDialog'

import Square from './Square'

const useStyles = makeStyles(theme => ({
  spacing: {
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}))

export default function Group({ groupId }) {
  const history = useHistory()
  const classes = useStyles()
  const groupFields = useFields('Group')
  const userFields = useFields('User')

  const { data, loading, refetch: loadGroup } = useQuery(
    LOAD_GROUP(groupFields.all, userFields.all),
    {
      variables: { id: groupId }
    }
  )
  const [addUsersToGroupDialog, openAddUsersToGroup] = useAddUsersToGroupDialog(
    groupId,
    loadGroup
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

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      {addUsersToGroupDialog}
      {confirmDeleteDialog}
      {confirmRemoveUserDialog}
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Chip
            label={
              <Typography>
                <Link component={RouterLink} color="inherit" to=".">
                  Groups
                </Link>
              </Typography>
            }
          />
          <Chip
            label={
              <Typography color="textPrimary">
                {data.group[groupFields.description]}
              </Typography>
            }
          />
        </Breadcrumbs>
      </Box>
      <Box mb={3} className={classes.spacing}>
        <Button
          variant="contained"
          color="primary"
          onClick={openAddUsersToGroup}
        >
          Add users
        </Button>
        <Button variant="outlined" onClick={handleDeleteGroup}>
          Delete group
        </Button>
      </Box>
      <Square mb={3}>
        <Typography variant="h6">Group</Typography>
        <List>
          {groupFields.all.map(field => (
            <ListItem key={field}>
              <ListItemText
                primary={startCase(field)}
                secondary={data.group[field] || '-'}
              ></ListItemText>
            </ListItem>
          ))}
        </List>
      </Square>
      <Square mb={3}>
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{startCase(userFields.description)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.group.users?.map(user => (
              <TableRow key={user[userFields.id]}>
                <TableCell>
                  <Link
                    color="secondary"
                    component={RouterLink}
                    to={`../users/${user[userFields.id]}`}
                  >
                    <Typography>{user[userFields.description]}</Typography>
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
      </Square>
    </>
  )
}

Group.propTypes = {
  groupId: T.string.isRequired
}
