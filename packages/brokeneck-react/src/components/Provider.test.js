import React from 'react'
import { screen, render } from '@testing-library/react'

import { withRootContext } from '../test-utils/providers'

import Provider from './Provider'

describe('Provider', () => {
  it('should render Provider component with a known provider', () => {
    render(withRootContext(<Provider />))

    expect(screen.queryByTestId('provider-icon')).toBeInTheDocument()
    expect(screen.queryByText('cognito')).toBeInTheDocument()
  })

  it('should render Provider component with an unknown provider', () => {
    render(withRootContext(<Provider />, { provider: { name: 'unknown' } }))

    expect(screen.queryByTestId('provider-icon')).not.toBeInTheDocument()
    expect(screen.queryByText('unknown')).toBeInTheDocument()
  })
})
