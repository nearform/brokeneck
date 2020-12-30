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

import useCreateGroupDialog from '../hooks/useCreateGroupDialog'
import useFields, { TYPE_NAMES } from '../hooks/useFields'
import useSurrogatePagination from '../hooks/useSurrogatePagination'
import { LOAD_GROUPS } from '../graphql'
import useProvider from '../hooks/useProvider'

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

export default function Groups() {
  const match = useRouteMatch()
  const groupFields = useFields('Group')
  const [search, setSearch] = useState({ immediate: '', debounced: '' })
  const classes = useStyles()
  const {
    capabilities: { canSearchGroups }
  } = useProvider()

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

  const { data, loading, refetch: loadGroups } = useQuery(
    LOAD_GROUPS(groupFields.all),
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

  const [dialog, openDialog] = useCreateGroupDialog(loadGroups)

  useUpdateSurrogatePageNumber(data?.groups.nextPage)

  const tablePagination = useTablePagination(data?.groups)

  return (
    <>
      {dialog}
      <Square mb={3}>
        <Box className={classes.spacing} mb={3}>
          <Button variant="contained" color="primary" onClick={openDialog}>
            Create Group
          </Button>
          {canSearchGroups && (
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
          )}
          <div className={classes.right}>
            <IconButton onClick={loadGroups} title="reload groups">
              <Typography>
                <span role="img" aria-label="reload groups">
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
                            {groupFields.format(field, group[field])}
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
                          {groupFields.format(field, group[field])}
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {loading && (
                <TableRow>
                  <TableCell colSpan={groupFields.all.length}>
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
