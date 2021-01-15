import React from 'react'
import T from 'prop-types'
import { screen, render, waitFor, fireEvent } from '@testing-library/react'
import { useQuery } from 'graphql-hooks'
import deepmerge from 'deepmerge'

import mockRootContext from '../test-utils/mockRootContext'
import { withThemeSwitcher, withRouter } from '../test-utils/providers'
import { LOAD_ROOT } from '../graphql'

import RootContext from './RootContext'
import User from './User'

const RootContextWrapper = ({ children }) => {
  return (
    <RootContext.Provider value={mockRootContext}>
      {children}
    </RootContext.Provider>
  )
}

RootContextWrapper.propTypes = {
  children: T.node
}

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
        groups: [
          {
            GroupName: 'AnotherGroup',
            Description: 'Another group description',
            CreationDate: '2021-01-05T10:42:20.733Z',
            LastModifiedDate: '2021-01-05T10:42:20.733Z',
            users: { data: [], nextPage: '234567' }
          }
        ]
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

const mockMutation = jest.fn()

jest.mock('graphql-hooks', () => {
  const originalLib = jest.requireActual('graphql-hooks')

  return {
    ...originalLib,
    useMutation: jest.fn().mockImplementation(() => [mockMutation]),
    useQuery: jest.fn()
  }
})

const mockGoBack = jest.fn()

jest.mock('react-router-dom', () => {
  const originalLib = jest.requireActual('react-router-dom')

  return {
    ...originalLib,
    useHistory: jest.fn().mockImplementation(() => ({ goBack: mockGoBack })),
    useQuery: jest.fn()
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('user', () => {
  it('should render user component', () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<User userId="1234" />), {
      wrapper: RootContextWrapper
    })

    expect(screen.getByText(/Add to group/i)).toBeInTheDocument()
    expect(screen.getByText(/Delete user/i)).toBeInTheDocument()
    expect(screen.getAllByTestId(/user-group-chip/i).length).toEqual(1)
  })

  it('should open delete dialog when "Delete user" clicked', async () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<User userId="1234" />), {
      wrapper: RootContextWrapper
    })
    screen.getByRole('button', { name: /Delete user/i }).click()

    expect(screen.getByTestId('dialog-form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('should delete user when "Delete user" dialog submitted', async () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<User userId="1234" />), {
      wrapper: RootContextWrapper
    })
    screen.getByRole('button', { name: /Delete user/i }).click()

    fireEvent.submit(screen.getByTestId('dialog-form'))

    await waitFor(() =>
      expect(mockMutation).toBeCalledWith(
        expect.objectContaining({
          variables: {
            input: {
              id: '1234'
            }
          }
        })
      )
    )

    expect(mockGoBack).toHaveBeenCalled()
  })

  it('should open dialog when remove user from group icon button clicked', async () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<User userId="1234" />), {
      wrapper: RootContextWrapper
    })

    const [chip] = screen.getAllByTestId(/user-group-chip/i)
    const removeUserFromGroupButton = chip.querySelector('.MuiChip-deleteIcon')
    fireEvent.click(removeUserFromGroupButton)

    expect(screen.getByTestId('dialog-form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('should remove user from group when remove user dialog submitted', async () => {
    const mockRefetch = jest.fn()
    useQuery.mockImplementation(mockUseQuery({ refetch: mockRefetch }))

    render(withProviders(<User userId="1234" />), {
      wrapper: RootContextWrapper
    })

    const [chip] = screen.getAllByTestId(/user-group-chip/i)
    const removeUserFromGroupButton = chip.querySelector('.MuiChip-deleteIcon')
    fireEvent.click(removeUserFromGroupButton)

    fireEvent.submit(screen.getByTestId('dialog-form'))

    await waitFor(() =>
      expect(mockMutation).toBeCalledWith(
        expect.objectContaining({
          variables: {
            input: {
              userId: '1234',
              groupId: 'AnotherGroup'
            }
          }
        })
      )
    )

    expect(mockRefetch).toHaveBeenCalled()
  })
})
