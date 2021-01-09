import T from 'prop-types'
import { renderHook } from '@testing-library/react-hooks'

import { withRootContext } from '../test-utils/providers'

import useProvider from './useProvider'

const contextProviderValue = { provider: { name: 'cognito' } }
function Wrapper({ children }) {
  return withRootContext(children, contextProviderValue)
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
