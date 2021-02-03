import React from 'react'
import T from 'prop-types'
import { screen, render, waitFor, fireEvent } from '@testing-library/react'
import { useQuery } from 'graphql-hooks'
import deepmerge from 'deepmerge'

import mockRootContext from '../test-utils/mockRootContext'
import { withThemeSwitcher, withRouter } from '../test-utils/providers'
import { LOAD_ROOT } from '../graphql'

import RootContext from './RootContext'
import Group from './Group'

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
      users: {
        data: [
          {
            objectId: 'user_alice',
            displayName: 'Alice',
            mailNickname: 'Alice123',
            createdDateTime: '2020-11-29T18:04:56Z',
            accountEnabled: true
          },
          {
            objectId: 'user_charlie',
            displayName: 'Charlie',
            mailNickname: 'Charlie123',
            createdDateTime: '2020-11-29T18:04:56Z',
            accountEnabled: true
          }
        ],
        nextPage: '234567'
      }
    }
  }

  if (/query LoadGroup\(/.test(query)) {
    data = {
      group: {
        GroupName: 'AnotherGroup',
        Description: 'Another group description',
        CreationDate: '2021-01-05T10:42:20.733Z',
        LastModifiedDate: '2021-01-05T10:42:20.733Z',
        users: {
          data: [
            {
              objectId: 'a_user',
              displayName: 'Bobby',
              createdDateTime: '2021-01-07T12:33:07.571Z',
              groups: []
            }
          ],
          nextPage: '234567'
        }
      },
      users: {
        data: [
          {
            objectId: 'user_alice',
            displayName: 'Alice',
            mailNickname: 'Alice123',
            createdDateTime: '2020-11-29T18:04:56Z',
            accountEnabled: true
          },
          {
            objectId: 'user_charlie',
            displayName: 'Charlie',
            mailNickname: 'Charlie123',
            createdDateTime: '2020-11-29T18:04:56Z',
            accountEnabled: true
          }
        ],
        nextPage: '234567'
      }
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

describe('Group', () => {
  it('should render Group component', () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Group groupId="1234" />), {
      wrapper: RootContextWrapper
    })

    expect(screen.getByText(/Add users/i)).toBeInTheDocument()
    expect(screen.getByText(/Delete group/i)).toBeInTheDocument()
    expect(screen.getAllByRole('row').length).toEqual(2)
  })

  it('should open add dialog when "Add users" clicked', async () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Group groupId="1234" />), {
      wrapper: RootContextWrapper
    })
    screen.getByRole('button', { name: /Add users/i }).click()

    expect(screen.getByTestId('dialog-form')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Add to group' })
    ).toBeInTheDocument()
  })

  it('should add selected user when "Add users" dialog submitted', async () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Group groupId="1234" />), {
      wrapper: RootContextWrapper
    })
    screen.getByRole('button', { name: /Add users/i }).click()

    const submitButton = screen.getByRole('button', { name: 'Add to group' })
    expect(submitButton).toBeDisabled()

    const input = screen.getByLabelText(/Display Name/i)
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })

    screen.getByText(/Alice/i).click()
    submitButton.click()

    await waitFor(() => {
      expect(mockMutation).toBeCalledWith({
        variables: {
          skipErrorHandling: true,
          input: {
            groupId: '1234',
            userId: 'user_alice'
          }
        }
      })
    })
  })

  it('should open delete dialog when "Delete group" clicked', async () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Group groupId="1234" />), {
      wrapper: RootContextWrapper
    })
    screen.getByRole('button', { name: /Delete group/i }).click()

    expect(screen.getByTestId('dialog-form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('should delete group when "Delete group" dialog submitted', async () => {
    useQuery.mockImplementation(mockUseQuery())

    render(withProviders(<Group groupId="1234" />), {
      wrapper: RootContextWrapper
    })
    screen.getByRole('button', { name: /Delete group/i }).click()

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

    render(withProviders(<Group groupId="1234" />), {
      wrapper: RootContextWrapper
    })
    screen
      .getAllByRole('button', { name: /remove user from group/i })[0]
      .click()

    expect(screen.getByTestId('dialog-form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('should remove user from group when remove user dialog submitted', async () => {
    const mockRefetch = jest.fn()
    useQuery.mockImplementation(mockUseQuery({ refetch: mockRefetch }))

    render(withProviders(<Group groupId="1234" />), {
      wrapper: RootContextWrapper
    })
    screen
      .getAllByRole('button', { name: /remove user from group/i })[0]
      .click()

    fireEvent.submit(screen.getByTestId('dialog-form'))

    await waitFor(() =>
      expect(mockMutation).toBeCalledWith(
        expect.objectContaining({
          variables: {
            input: {
              groupId: '1234',
              userId: 'a_user'
            }
          }
        })
      )
    )

    expect(mockRefetch).toHaveBeenCalled()
  })
})
