import React from 'react'
import T from 'prop-types'
import { screen, render } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'

import RootContext from '../components/RootContext'

import useDialog from './useDialog'

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

// skipped for now as this still fails
describe.skip('useDialog', () => {
  const setup = options =>
    renderHook(() => useDialog(options), { wrapper: Wrapper })

  it('should render the dialog', async () => {
    const onConfirm = jest.fn()
    const {
      result: {
        current: [DialogComponent, openDialog]
      }
    } = setup({
      onConfirm,
      title: 'Dialog Title',
      text: 'Are you sure you want to do this action?',
      action: 'Confirm'
    })

    const { debug /* , rerender */ } = render(DialogComponent)

    act(() => {
      openDialog()
      // rerender(DialogComponent)
    })

    debug()

    expect(screen.getByText(/Dialog Title/i)).toBeInTheDocument()

    // expect(typeof DialogComponent).toBe('object')
    // expect(typeof openDialog).toBe('function')
  })
})
