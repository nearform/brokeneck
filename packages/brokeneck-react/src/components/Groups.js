import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import React from 'react'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import useCreateGroupDialog from '../hooks/useCreateGroupDialog'
import { LOAD_GROUPS } from '../graphql'
import useFields from '../hooks/useFields'

import Square from './Square'

export default function Groups() {
  const match = useRouteMatch()
  const groupFields = useFields('Group')
  const { data, loading, refetch: loadGroups } = useQuery(
    LOAD_GROUPS(groupFields.all)
  )
  const [dialog, openDialog] = useCreateGroupDialog(loadGroups)

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
            Create Group
          </Button>
          <IconButton onClick={loadGroups} title="reload groups">
            <Typography>
              <span role="img" aria-label="reload groups">
                🔃
              </span>
            </Typography>
          </IconButton>
        </Box>
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
            {data?.groups.map(group => (
              <TableRow key={group[groupFields.id]}>
                {groupFields.all.map((field, index) => (
                  <TableCell key={field}>
                    {!index ? (
                      <Link
                        color="secondary"
                        component={RouterLink}
                        to={`${match.url}/${group[groupFields.id]}`}
                      >
                        <Typography>{group[field]}</Typography>
                      </Link>
                    ) : groupFields.metadata[field].type === 'checkbox' ? (
                      <Typography align="center">
                        <span role="img" aria-label={field}>
                          {group[field] ? '✅' : '❌'}
                        </span>
                      </Typography>
                    ) : (
                      <Typography>{group[field]}</Typography>
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
      </Square>
    </>
  )
}
