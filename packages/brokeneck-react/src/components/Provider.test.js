import React from 'react'
import { screen, render } from '@testing-library/react'

import RootContext from '../components/RootContext'

import Provider from './Provider'

describe('Provider', () => {
  it('should render Provider component with a known provider', () => {
    render(
      <RootContext.Provider value={{ provider: { name: 'cognito' } }}>
        <Provider />
      </RootContext.Provider>
    )

    expect(screen.queryByTestId('provider-icon')).toBeInTheDocument()
    expect(screen.queryByText('cognito')).toBeInTheDocument()
  })

  it('should render Provider component with an unknown provider', () => {
    render(
      <RootContext.Provider value={{ provider: { name: 'unknown' } }}>
        <Provider />
      </RootContext.Provider>
    )

    expect(screen.queryByTestId('provider-icon')).toBeNull()
    expect(screen.queryByText('unknown')).toBeInTheDocument()
  })
})
