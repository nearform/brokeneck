import React from 'react'
import { screen, render } from '@testing-library/react'

import { withAllProviders } from '../test-utils/providers'

import Navigation from './Navigation'

describe('Navigation', () => {
  it('should render the Navigation component with dark theme', () => {
    localStorage.setItem('themeType', 'dark')

    render(withAllProviders(<Navigation />))

    expect(screen.queryByTestId('navigation')).toBeInTheDocument()
    expect(screen.queryByTestId('switch-to-light-theme')).toBeInTheDocument()
  })

  it('should render the Navigation component with light theme', () => {
    localStorage.setItem('themeType', 'light')

    render(withAllProviders(<Navigation />))

    expect(screen.queryByTestId('navigation')).toBeInTheDocument()
    expect(screen.queryByTestId('switch-to-dark-theme')).toBeInTheDocument()
  })
})
