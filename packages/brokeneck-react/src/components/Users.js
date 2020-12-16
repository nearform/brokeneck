import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'
import startCase from 'lodash.startcase'
import debounce from 'lodash.debounce'

import useCreateUserDialog from '../hooks/useCreateUserDialog'
import useFields from '../hooks/useFields'
import useSurrogatePagination from '../hooks/useSurrogatePagination'
import { LOAD_USERS } from '../graphql'

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
  const userFields = useFields('User')
  const [search, setSearch] = useState({ immediate: '', debounced: '' })
  const classes = useStyles()

  const debouncedSetSearch = useMemo(() => debounce(setSearch, 500), [
    setSearch
  ])

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch])

  const {
    pageSize,
    surrogatePageNumber,
    useUpdateSurrogatePageNumber,
    useTablePagination
  } = useSurrogatePagination({ pageSizeOptions: [2, 3, 4] }) // TODO: temp small page sizes for testing

  const { data, loading, refetch: loadUsers } = useQuery(
    LOAD_USERS(userFields.all),
    {
      variables: {
        pageNumber: surrogatePageNumber,
        pageSize,
        search: search.debounced
      }
    }
  )

  const handleSearchChange = search => {
    setSearch(s => ({ ...s, immediate: search }))
    debouncedSetSearch(s => ({ ...s, debounced: search }))
  }

  const [dialog, openDialog] = useCreateUserDialog(loadUsers)

  useUpdateSurrogatePageNumber(data?.users.nextPage)

  const tablePagination = useTablePagination(data?.users)

  return (
    <>
      {dialog}
      <Square mb={3}>
        <Box className={classes.spacing} mb={3}>
          <Button variant="contained" color="primary" onClick={openDialog}>
            Create User
          </Button>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search.immediate}
            onChange={e => handleSearchChange(e.target.value)}
            InputProps={{
              endAdornment: search.immediate && (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearchChange('')}>
                    <Typography>
                      <span role="img" aria-label="clear">
                        ❌
                      </span>
                    </Typography>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
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
