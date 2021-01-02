import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import useCreateUserDialog from '../hooks/useCreateUserDialog'
import useFields, { TYPE_NAMES } from '../hooks/useFields'
import usePagination from '../hooks/usePagination'
import { LOAD_USERS } from '../graphql'
import useSearch from '../hooks/useSearch'

import Square from './Square'

const useStyles = makeStyles(theme => ({
  spacing: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  },
  right: {
    marginLeft: 'auto'
  }
}))

export default function Users() {
  const match = useRouteMatch()
  const classes = useStyles()
  const userFields = useFields('User')
  const { search, Search } = useSearch()

  const {
    pageSize,
    currentToken,
    useUpdateToken,
    useTablePagination
  } = usePagination({ pageSizeOptions: [2, 3, 4] }) // TODO: temp small page sizes for testing

  const { data, loading, refetch: loadUsers } = useQuery(
    LOAD_USERS(userFields.all),
    {
      variables: {
        pageNumber: currentToken,
        pageSize,
        search
      }
    }
  )

  const [dialog, openDialog] = useCreateUserDialog(loadUsers)

  useUpdateToken(data?.users.nextPage)

  const tablePagination = useTablePagination(data?.users)

  return (
    <>
      {dialog}
      <Square mb={3}>
        <Box className={classes.spacing} mb={3}>
          <Button variant="contained" color="primary" onClick={openDialog}>
            Create User
          </Button>
          {Search}
          <div className={classes.right}>
            <IconButton onClick={loadUsers} title="reload users">
              <Typography>
                <span role="img" aria-label="reload users">
                  🔃
                </span>
              </Typography>
            </IconButton>
          </div>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {userFields.all.map(field => (
                  <TableCell
                    align={
                      userFields.metadata[field].type === 'checkbox'
                        ? 'center'
                        : undefined
                    }
                    key={field}
                  >
                    {startCase(field)}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.users.data.map(user => (
                <TableRow key={user[userFields.id]}>
                  {userFields.all.map((field, index) => (
                    <TableCell key={field}>
                      {!index ? (
                        <Link
                          color="secondary"
                          component={RouterLink}
                          to={`${match.url}/${user[userFields.id]}`}
                        >
                          <Typography>
                            {userFields.format(field, user[field])}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography
                          align={
                            userFields.isType(field, TYPE_NAMES.Boolean)
                              ? 'center'
                              : undefined
                          }
                        >
                          {userFields.format(field, user[field])}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={userFields.all.length}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {tablePagination}
      </Square>
    </>
  )
}
