import React from 'react'
import { screen, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import RootContext from '../components/RootContext'
import ThemeSwitcherProvider from '../components/ThemeSwitcherProvider'

import Navigation from './Navigation'

describe('Navigation', () => {
  it('should render the Navigation component with dark theme', () => {
    localStorage.setItem('themeType', 'dark')

    render(
      <RootContext.Provider value={{ provider: { name: 'cognito' } }}>
        <ThemeSwitcherProvider>
          <MemoryRouter initialEntries={['/users']}>
            <Navigation />
          </MemoryRouter>
        </ThemeSwitcherProvider>
      </RootContext.Provider>
    )

    expect(screen.queryByTestId('navigation')).toBeInTheDocument()
    expect(screen.queryByTestId('switch-to-light-theme')).toBeInTheDocument()
  })

  it('should render the Navigation component with light theme', () => {
    localStorage.setItem('themeType', 'light')

    render(
      <RootContext.Provider value={{ provider: { name: 'cognito' } }}>
        <ThemeSwitcherProvider>
          <MemoryRouter initialEntries={['/users']}>
            <Navigation />
          </MemoryRouter>
        </ThemeSwitcherProvider>
      </RootContext.Provider>
    )

    expect(screen.queryByTestId('navigation')).toBeInTheDocument()
    expect(screen.queryByTestId('switch-to-dark-theme')).toBeInTheDocument()
  })
})
