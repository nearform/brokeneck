import React from 'react'
import { screen, render } from '@testing-library/react'
import { useQuery } from 'graphql-hooks'
import deepmerge from 'deepmerge'

import { withThemeSwitcher, withRouter } from '../test-utils/providers'
import mockRootContext from '../test-utils/mockRootContext'
import { LOAD_ROOT } from '../graphql'

import Admin from './Admin'

const withProviders = (children, options) => {
  const { path = '/users' } = options || {}
  return withThemeSwitcher(withRouter(children, path))
}

const mockUseQuery = (overrides = {}) => query => {
  let data = {}

  if (query === LOAD_ROOT) {
    data = mockRootContext
  }

  if (/query LoadUsers\(/.test(query)) {
    data = {
      users: { data: [], nextPage: '234567' }
    }
  }

  if (/query LoadUser\(/.test(query)) {
    data = {
      user: {
        Username: 'a_user',
        Enabled: true,
        UserStatus: 'FORCE_CHANGE_PASSWORD',
        UserCreateDate: '2021-01-07T12:33:07.571Z',
        UserLastModifiedDate: '2021-01-07T12:33:07.571Z',
        groups: []
      },
      groups: { data: [], nextPage: '234567' }
    }
  }

  if (/query LoadGroups\(/.test(query)) {
    data = {
      groups: { data: [], nextPage: '234567' }
    }
  }

  if (/query LoadGroup\(/.test(query)) {
    data = {
      group: {
        GroupName: 'AnotherGroup',
        Description: 'Another group description',
        CreationDate: '2021-01-05T10:42:20.733Z',
        LastModifiedDate: '2021-01-05T10:42:20.733Z',
        users: { data: [], nextPage: '234567' }
      },
      users: { data: [], nextPage: '234567' }
    }
  }

  return deepmerge({ data, loading: false }, overrides)
}

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
    useQuery.mockImplementation(
      mockUseQuery({
        loading: true
      })
    )

    render(withProviders(<Admin />))

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded for users', () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Admin />, { path: '/users' }))

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded for a single user', () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Admin />, { path: '/users/a-user' }))

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded for groups', () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Admin />, { path: '/groups' }))

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })

  it('should render Admin component when data has loaded for a single group', () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Admin />, { path: '/groups/another-group' }))

    expect(screen.getByTestId('navigation')).toBeInTheDocument()
  })
})
