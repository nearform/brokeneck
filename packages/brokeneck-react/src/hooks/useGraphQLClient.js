import React, { useState } from 'react'
import T from 'prop-types'
import { GraphQLClient } from 'graphql-hooks'

import GraphQLErrorContext from '../components/GraphQLErrorContext'
import GraphQLError from '../GraphQLError'

export default function useGraphQLClient(url, token) {
  const [graphQLError, setGraphQLError] = useState()

  const client = new GraphQLClient({
    url,
    onError({ operation, result }) {
      if (operation.variables?.skipErrorHandling) {
        return
      }

      setGraphQLError(new GraphQLError(result.error))
    }
  })

  if (token) {
    client.setHeader('Authorization', `Bearer ${token}`)
  }

  function GraphQLErrorContextProvider({ children }) {
    return (
      <GraphQLErrorContext.Provider value={graphQLError}>
        {children}
      </GraphQLErrorContext.Provider>
    )
  }
  GraphQLErrorContextProvider.propTypes = {
    children: T.node
  }

  return [client, GraphQLErrorContextProvider]
}
