import React from 'react'
import T from 'prop-types'
import { renderHook } from '@testing-library/react-hooks'

import RootContext from '../components/RootContext'

import useProvider from './useProvider'

const contextProviderValue = { provider: { name: 'coginto' } }

function Wrapper({ children }) {
  return (
    <RootContext.Provider value={contextProviderValue}>
      {children}
    </RootContext.Provider>
  )
}

Wrapper.propTypes = {
  children: T.node
}

describe('useProvider', () => {
  const setup = () => renderHook(() => useProvider(), { wrapper: Wrapper })

  it('should return type when found', () => {
    const { result } = setup()

    expect(result.current).toBe(contextProviderValue.provider)
  })
})
