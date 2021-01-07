import React from 'react'
import { screen, render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'

import ThemeSwitcherProvider from '../components/ThemeSwitcherProvider'

import Admin from './Admin'

jest.mock('graphql-hooks', () => {
  const originalLib = jest.requireActual('graphql-hooks')

  return {
    ...originalLib,
    useMutation: jest.fn().mockImplementation(() => [jest.fn()]),
    useQuery: jest.fn()
  }
})

jest.mock('../hooks/useSchema', () => () => ({
  name: 'UserInput',
  fields: null,
  inputFields: [
    {
      name: '_',
      type: {
        name: 'Ignored',
        kind: 'SCALAR',
        ofType: null
      }
    },
    {
      name: 'Username',
      type: {
        name: null,
        kind: 'NON_NULL',
        ofType: {
          name: 'String',
          kind: 'SCALAR'
        }
      }
    }
  ]
}))

describe('Admin', () => {
  it('should render Admin component when loading', () => {
    useQuery.mockImplementation(() => ({
      data: { provider: { name: 'cognito' } },
      loading: true
    }))

    render(
      <ThemeSwitcherProvider>
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      </ThemeSwitcherProvider>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded', () => {
    // This is dirty, as it returns a mix of responses for all queries
    useQuery.mockImplementation(() => ({
      data: {
        provider: { name: 'cognito' },
        users: { data: [], nextPage: '234567' }
      },
      loading: false
    }))

    render(
      <ThemeSwitcherProvider>
        <BrowserRouter>
          <Admin />
        </BrowserRouter>
      </ThemeSwitcherProvider>
    )

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })
})
