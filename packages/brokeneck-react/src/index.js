import React from 'react'
import T from 'prop-types'
import { ClientContext } from 'graphql-hooks'
import { BrowserRouter } from 'react-router-dom'

import ThemeSwitcherProvider from './components/ThemeSwitcherProvider'
import Admin from './components/Admin'
import ErrorBoundary from './components/ErrorBoundary'
import GraphQLErrorBoundary from './components/GraphQLErrorBoundary'
import useGraphQLClient from './hooks/useGraphQLClient'

export default function Main({ token, serverUrl, basename }) {
  const [client, GraphQLErrorContextProvider] = useGraphQLClient(
    serverUrl,
    token
  )

  return (
    <ThemeSwitcherProvider>
      <GraphQLErrorContextProvider>
        <GraphQLErrorBoundary>
          <ErrorBoundary>
            <ClientContext.Provider value={client}>
              <BrowserRouter basename={basename}>
                <Admin />
              </BrowserRouter>
            </ClientContext.Provider>
          </ErrorBoundary>
        </GraphQLErrorBoundary>
      </GraphQLErrorContextProvider>
    </ThemeSwitcherProvider>
  )
}

Main.propTypes = {
  serverUrl: T.string.isRequired,
  basename: T.string,
  token: T.string
}
