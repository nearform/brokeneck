import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import RootContext from '../components/RootContext'
import ThemeSwitcherProvider from '../components/ThemeSwitcherProvider'

export const withAllProviders = (children, options) => {
  const { path = '/users', rootContext } = options || {}
  return withRootContext(
    withThemeSwitcher(withRouter(children, path)),
    rootContext
  )
}

export const withRootContext = (
  children,
  value = { provider: { name: 'cognito' } }
) => <RootContext.Provider value={value}>{children}</RootContext.Provider>

export const withRouter = (children, path = '/users') => (
  <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
)

export const withThemeSwitcher = children => (
  <ThemeSwitcherProvider>{children}</ThemeSwitcherProvider>
)
