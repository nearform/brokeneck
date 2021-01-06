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
import { useTheme } from '@material-ui/core/styles'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import useCreateGroupDialog from '../hooks/useCreateGroupDialog'
import useFields, { TYPE_NAMES } from '../hooks/useFields'
import usePagination from '../hooks/usePagination'
import { LOAD_GROUPS } from '../graphql'
import useProvider from '../hooks/useProvider'
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
  },
  tableHead: {
    '& th': {
      backgroundColor: theme.palette.headerBackground.main,
      borderBottom: 0,
      fontWeight: 'bold'
    },
    '& th:first-child': {
      borderRadius: '10px 0 0 10px'
    },
    '& th:last-child': {
      borderRadius: '0 10px 10px 0'
    }
  }
}))

export default function Groups() {
  const match = useRouteMatch()
  const groupFields = useFields('Group')
  const { search, Search } = useSearch()
  const classes = useStyles()
  const theme = useTheme()
  const {
    capabilities: { canSearchGroups }
  } = useProvider()

  const {
    pageSize,
    currentToken,
    useUpdateToken,
    useTablePagination
  } = usePagination({ pageSizeOptions: [10, 20, 30] })

  const { data, loading, refetch: loadGroups } = useQuery(
    LOAD_GROUPS(groupFields.all),
    {
      variables: {
        pageNumber: currentToken,
        pageSize,
        search
      }
    }
  )

  const [dialog, openDialog] = useCreateGroupDialog(loadGroups)

  useUpdateToken(data?.groups.nextPage)

  const tablePagination = useTablePagination(data?.groups)

  return (
    <>
      {dialog}
      <Box mb={3} className={classes.header}>
        <Typography variant="h1">Groups</Typography>
        <div className={classes.actions}>
          <Button
            onClick={openDialog}
            title="Add group"
            className={classes.actionButton}
          >
            Add <PlusIcon />
          </Button>
          <div className={classes.separator}></div>
          <Button
            onClick={loadGroups}
            title="Refresh groups"
            className={classes.actionButton}
          >
            Refresh <RefreshIcon />
          </Button>
        </div>
        {loading && <CircularProgress />}
        {canSearchGroups && <div className={classes.search}>{Search}</div>}
      </Box>
      <Square mb={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow classes={{ head: classes.tableHead }}>
                {groupFields.all.map(field => (
                  <TableCell
                    align={
                      groupFields.metadata[field].type === 'checkbox'
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
              {data?.groups.data.map(group => (
                <TableRow key={group[groupFields.id]}>
                  {groupFields.all.map((field, index) => (
                    <TableCell key={field}>
                      {!index ? (
                        <Link
                          color="secondary"
                          component={RouterLink}
                          to={`${match.url}/${group[groupFields.id]}`}
                        >
                          <Typography>
                            {groupFields.format(field, group[field], theme)}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography
                          align={
                            groupFields.isType(field, TYPE_NAMES.Boolean)
                              ? 'center'
                              : undefined
                          }
                        >
                          {groupFields.format(field, group[field], theme)}
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
