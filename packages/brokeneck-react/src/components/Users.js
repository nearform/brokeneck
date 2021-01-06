import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
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
import { Link as RouterLink, useHistory, useRouteMatch } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import useCreateUserDialog from '../hooks/useCreateUserDialog'
import useFields, { TYPE_NAMES } from '../hooks/useFields'
import usePagination from '../hooks/usePagination'
import { LOAD_USERS } from '../graphql'
import useSearch from '../hooks/useSearch'
import PlusIcon from '../icons/plus'
import RefreshIcon from '../icons/refresh'

import Square from './Square'

const useStyles = makeStyles(theme => ({
  actions: {
    alignItems: 'center',
    borderLeft: `1px solid ${theme.palette.separator.main}`,
    display: 'flex',
    marginLeft: theme.spacing(2.5),
    marginTop: 10,
    paddingLeft: theme.spacing(1)
  },
  actionButton: {
    textTransform: 'none',
    '& svg': {
      fill: theme.palette.primary.main,
      marginLeft: theme.spacing(1)
    }
  },
  actionIcon: {
    height: 20,
    width: 20
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: theme.spacing(2.5)
  },
  right: {
    marginLeft: 'auto'
  },
  search: {
    marginLeft: 'auto'
  },
  separator: {
    borderLeft: `1px solid ${theme.palette.separator.main}`,
    height: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  spacing: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}))

export default function Users() {
  const match = useRouteMatch()
  const classes = useStyles()
  const userFields = useFields('User')
  const { search, Search } = useSearch()
  const history = useHistory()

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
      <Box mb={3} className={classes.header}>
        <Typography variant="h1">Users</Typography>
        <div className={classes.actions}>
          <Button
            onClick={openDialog}
            title="Add user"
            className={classes.actionButton}
          >
            Add <PlusIcon className={classes.actionIcon} />
          </Button>
          <div className={classes.separator}></div>
          <Button
            onClick={loadUsers}
            title="Refresh groups"
            className={classes.actionButton}
          >
            Refresh <RefreshIcon className={classes.actionIcon} />
          </Button>
        </div>
        {loading && <CircularProgress />}
        <div className={classes.search}>{Search}</div>
      </Box>
      <Square mb={3}>
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
                <TableRow
                  key={user[userFields.id]}
                  onClick={() =>
                    history.push(`${match.url}/${user[userFields.id]}`)
                  }
                >
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
            </TableBody>
          </Table>
        </TableContainer>
        {tablePagination}
      </Square>
    </>
  )
}
