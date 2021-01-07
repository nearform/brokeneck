import React from 'react'
import T from 'prop-types'
import { renderHook } from '@testing-library/react-hooks'

import RootContext from '../components/RootContext'

import useSchema from './useSchema'

const UserType = { name: 'User' }

function Wrapper({ children }) {
  return (
    <RootContext.Provider value={{ __schema: { types: [UserType] } }}>
      {children}
    </RootContext.Provider>
  )
}

Wrapper.propTypes = {
  children: T.node
}

describe('useSchema', () => {
  const setup = typeName =>
    renderHook(() => useSchema(typeName), { wrapper: Wrapper })

  it('should return type when found', () => {
    const { result } = setup('User')

    expect(result.current).toBe(UserType)
  })

  it('should return undefined when type is not found', () => {
    const { result } = setup('Unknown')

    expect(result.current).toBeUndefined()
  })
})
