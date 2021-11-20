import React, { useContext } from 'react'
import { Box, Typography } from '@material-ui/core'
import T from 'prop-types'

import GraphQLErrorContext from './GraphQLErrorContext'

export default function GraphQLErrorBoundary({ children }) {
  const graphqlError = useContext(GraphQLErrorContext)

  if (graphqlError) {
    return (
      <Box m={2}>
        <Typography variant="h5" gutterBottom>
          Something went wrong when interacting with the server.
        </Typography>
        <Box component="details" whiteSpace="pre-wrap">
          <Box component="summary" mb={2}>
            <Typography component="span">More details</Typography>
          </Box>
          <Typography color="error">{graphqlError.toString()}</Typography>
        </Box>
      </Box>
    )
  }

  return children
}

GraphQLErrorBoundary.propTypes = {
  children: T.node.isRequired
}
