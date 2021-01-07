import React from 'react'
import T from 'prop-types'
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
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import useFields, { TYPE_NAMES } from '../hooks/useFields'
import usePagination from '../hooks/usePagination'
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
    },
    '&:disabled, &[disabled] svg': {
      opacity: 0.5
    }
  },
  actionIcon: {
    height: 20,
    width: 20
  },
  entityName: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold'
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
  spinner: {
    display: 'flex',
    marginLeft: theme.spacing(2)
  },
  tableRowOdd: {
    backgroundColor: theme.palette.tableRowHighlight.main
  }
}))

export default function Entities({
  canSearch = true,
  entitiesName,
  entityName,
  entitiesKey,
  query,
  useCreateEntityDialog
}) {
  const match = useRouteMatch()
  const classes = useStyles()
  const fields = useFields(entityName)
  const { search, Search } = useSearch()

  const {
    pageSize,
    currentToken,
    useUpdateToken,
    useTablePagination
  } = usePagination({ pageSizeOptions: [2, 3, 4] }) // TODO: temp small page sizes for testing

  const { data, loading, refetch: loadEntities } = useQuery(query(fields.all), {
    variables: {
      pageNumber: currentToken,
      pageSize,
      search
    }
  })

  const [dialog, openDialog] = useCreateEntityDialog(loadEntities)

  useUpdateToken(data?.[entitiesKey].nextPage)

  const tablePagination = useTablePagination(data?.[entitiesKey])

  return (
    <>
      {dialog}
      <Square mb={3}>
        <Box mb={3} className={classes.header}>
          <Typography variant="h1">{entitiesName}</Typography>
          <Box className={classes.actions}>
            <Button
              onClick={openDialog}
              title={`Add ${entityName}`}
              className={classes.actionButton}
            >
              Add <PlusIcon className={classes.actionIcon} />
            </Button>
            <Box className={classes.separator}></Box>
            <Button
              disabled={loading}
              onClick={loadEntities}
              title={`Refresh ${entitiesName}`}
              className={classes.actionButton}
            >
              Refresh <RefreshIcon className={classes.actionIcon} />
            </Button>
            {loading && (
              <Box className={classes.spinner}>
                <CircularProgress size={20} />
              </Box>
            )}
          </Box>
          {canSearch && <Box className={classes.search}>{Search}</Box>}
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {fields.all.map(field => (
                  <TableCell
                    align={
                      fields.metadata[field].type === 'checkbox'
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
              {data?.[entitiesKey].data.map((item, idx) => (
                <TableRow
                  key={item[fields.id]}
                  className={idx % 2 !== 0 ? classes.tableRowOdd : ''}
                >
                  {fields.all.map((field, index) => (
                    <TableCell key={field}>
                      {!index ? (
                        <Link
                          className={classes.entityName}
                          color="secondary"
                          component={RouterLink}
                          to={`${match.url}/${item[fields.id]}`}
                        >
                          <Typography>
                            {fields.format(field, item[field])}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography
                          className={index === 0 ? classes.entityName : ''}
                          align={
                            fields.isType(field, TYPE_NAMES.Boolean)
                              ? 'center'
                              : undefined
                          }
                        >
                          {fields.format(field, item[field])}
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

Entities.propTypes = {
  canSearch: T.bool,
  entitiesName: T.string.isRequired,
  entityName: T.string.isRequired,
  entitiesKey: T.string.isRequired,
  query: T.func.isRequired,
  useCreateEntityDialog: T.func.isRequired
}
