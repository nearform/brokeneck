import React from 'react'
import { screen, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'

import ThemeSwitcherProvider from '../components/ThemeSwitcherProvider'
import mockRootContext from '../test-utils/mockRootContext'

import Admin from './Admin'

jest.mock('graphql-hooks', () => {
  const originalLib = jest.requireActual('graphql-hooks')

  return {
    ...originalLib,
    useMutation: jest.fn().mockImplementation(() => [jest.fn()]),
    useQuery: jest.fn()
  }
})

describe('Admin', () => {
  it('should render Admin component when loading', () => {
    useQuery.mockImplementation(() => ({
      data: { provider: { name: 'cognito' } },
      loading: true
    }))

    render(
      <ThemeSwitcherProvider>
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      </ThemeSwitcherProvider>
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded for users', () => {
    // This is dirty, as it returns a mix of responses for all queries
    useQuery.mockImplementation(() => {
      return {
        data: {
          provider: { name: 'cognito' },
          users: { data: [], nextPage: '234567' },
          ...mockRootContext
        },
        loading: false
      }
    })

    render(
      <ThemeSwitcherProvider>
        <MemoryRouter initialEntries={['/users']}>
          <Admin />
        </MemoryRouter>
      </ThemeSwitcherProvider>
    )

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded for a single user', () => {
    // This is dirty, as it returns a mix of responses for all queries
    useQuery.mockImplementation(() => {
      return {
        data: {
          provider: {
            capabilities: { canSearchGroups: true },
            name: 'cognito'
          },
          user: {
            Username: 'a_user',
            Enabled: true,
            UserStatus: 'FORCE_CHANGE_PASSWORD',
            UserCreateDate: '2021-01-07T12:33:07.571Z',
            UserLastModifiedDate: '2021-01-07T12:33:07.571Z',
            groups: []
          },
          groups: { data: [], nextPage: '234567' },
          ...mockRootContext
        },
        loading: false
      }
    })

    render(
      <ThemeSwitcherProvider>
        <MemoryRouter initialEntries={['/users/a-user']}>
          <Admin />
        </MemoryRouter>
      </ThemeSwitcherProvider>
    )

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded for groups', () => {
    // This is dirty, as it returns a mix of responses for all queries
    useQuery.mockImplementation(() => {
      return {
        data: {
          provider: {
            capabilities: { canSearchGroups: true },
            name: 'cognito'
          },
          groups: { data: [], nextPage: '234567' },
          ...mockRootContext
        },
        loading: false
      }
    })

    render(
      <ThemeSwitcherProvider>
        <MemoryRouter initialEntries={['/groups']}>
          <Admin />
        </MemoryRouter>
      </ThemeSwitcherProvider>
    )

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded for a single group', () => {
    // This is dirty, as it returns a mix of responses for all queries
    useQuery.mockImplementation(() => {
      return {
        data: {
          provider: {
            capabilities: { canSearchGroups: true },
            name: 'cognito'
          },
          group: {
            GroupName: 'AnotherGroup',
            Description: 'Another group description',
            CreationDate: '2021-01-05T10:42:20.733Z',
            LastModifiedDate: '2021-01-05T10:42:20.733Z',
            users: { data: [], nextPage: '234567' }
          },
          users: { data: [], nextPage: '234567' },
          ...mockRootContext
        },
        loading: false
      }
    })

    render(
      <ThemeSwitcherProvider>
        <MemoryRouter initialEntries={['/groups/another-group']}>
          <Admin />
        </MemoryRouter>
      </ThemeSwitcherProvider>
    )

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })
})
