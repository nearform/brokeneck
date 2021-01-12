import React from 'react'
import T from 'prop-types'
import { screen, render } from '@testing-library/react'

import GraphQLErrorBoundary from './GraphQLErrorBoundary'
import GraphQLErrorContext from './GraphQLErrorContext'

const GraphQLErrorContextWrapperError = ({ children }) => (
  <GraphQLErrorContext.Provider value={'Error fetching data'}>
    {children}
  </GraphQLErrorContext.Provider>
)

GraphQLErrorContextWrapperError.propTypes = {
  children: T.node
}

const GraphQLErrorContextWrapper = ({ children }) => (
  <GraphQLErrorContext.Provider value={null}>
    {children}
  </GraphQLErrorContext.Provider>
)

GraphQLErrorContextWrapper.propTypes = {
  children: T.node
}

describe('GraphQLErrorBoundary', () => {
  it('should render GraphQLErrorBoundary component when context provides error', () => {
    render(<GraphQLErrorBoundary>Children</GraphQLErrorBoundary>, {
      wrapper: GraphQLErrorContextWrapperError
    })

    expect(
      screen.queryByText(
        /Something went wrong when interacting with the server./i
      )
    ).toBeInTheDocument()
    expect(screen.queryByText(/More details/i)).toBeInTheDocument()
    expect(screen.queryByText(/Error fetching data/i)).toBeInTheDocument()
    expect(screen.queryByText(/Children/i)).not.toBeInTheDocument()
  })

  it('should render child components when no error', () => {
    render(<GraphQLErrorBoundary>Children</GraphQLErrorBoundary>, {
      wrapper: GraphQLErrorContextWrapper
    })

    expect(
      screen.queryByText(
        /Something went wrong when interacting with the server./i
      )
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/More details/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Error fetching data/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Children/i)).toBeInTheDocument()
  })
})
