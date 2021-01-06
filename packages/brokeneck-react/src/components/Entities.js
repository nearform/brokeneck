import React from 'react'
import T from 'prop-types'
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

import useFields, { TYPE_NAMES } from '../hooks/useFields'
import usePagination from '../hooks/usePagination'
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

export default function Entities({
  query,
  entityName,
  entitiesName,
  entitiesKey,
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
        <Box className={classes.spacing} mb={3}>
          <Button variant="contained" color="primary" onClick={openDialog}>
            {`Create ${entityName}`}
          </Button>
          {Search}
          <div className={classes.right}>
            <IconButton onClick={loadEntities} title={`reload ${entitiesName}`}>
              <Typography>
                <span role="img" aria-label={`reload ${entitiesName}`}>
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
              {data?.[entitiesKey].data.map(item => (
                <TableRow key={item[fields.id]}>
                  {fields.all.map((field, index) => (
                    <TableCell key={field}>
                      {!index ? (
                        <Link
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
              {loading && (
                <TableRow>
                  <TableCell colSpan={fields.all.length}>
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

Entities.propTypes = {
  query: T.func.isRequired,
  entityName: T.string.isRequired,
  entitiesName: T.string.isRequired,
  entitiesKey: T.string.isRequired,
  useCreateEntityDialog: toString.isRequired
}
