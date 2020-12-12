import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
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
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import useCreateUserDialog from '../hooks/useCreateUserDialog'
import useFields from '../hooks/useFields'
import useSurrogatePagination from '../hooks/useSurrogatePagination'
import { LOAD_USERS } from '../graphql'

import Square from './Square'

export default function Users() {
  const match = useRouteMatch()
  const userFields = useFields('User')

  const {
    pageSize,
    surrogatePageNumber,
    useUpdateSurrogatePageNumber,
    useTablePagination
  } = useSurrogatePagination({ pageSizeOptions: [2, 3, 4] })

  const { data, loading, refetch: loadUsers } = useQuery(
    LOAD_USERS(userFields.all),
    {
      variables: {
        pageNumber: surrogatePageNumber,
        pageSize
      }
    }
  )
  const [dialog, openDialog] = useCreateUserDialog(loadUsers)

  useUpdateSurrogatePageNumber(data?.users.nextPage)

  const tablePagination = useTablePagination(data?.users)

  return (
    <>
      {dialog}
      <Square mb={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Button variant="contained" color="primary" onClick={openDialog}>
            Create User
          </Button>
          <IconButton onClick={loadUsers} title="reload users">
            <Typography>
              <span role="img" aria-label="reload users">
                🔃
              </span>
            </Typography>
          </IconButton>
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
                          <Typography>{user[field]}</Typography>
                        </Link>
                      ) : userFields.metadata[field].type === 'checkbox' ? (
                        <Typography align="center">
                          <span role="img" aria-label={field}>
                            {user[field] ? '✅' : '❌'}
                          </span>
                        </Typography>
                      ) : (
                        <Typography>{user[field]}</Typography>
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
