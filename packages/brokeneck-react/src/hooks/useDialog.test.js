import { screen, render } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'

import useDialog from './useDialog'

describe('useDialog', () => {
  const setup = options => renderHook(() => useDialog(options))

  it('should open the dialog', async () => {
    const dialogTitle = 'Dialog Title'
    const dialogText = 'Are you sure you want to do this action?'
    const dialogAction = 'Confirm'

    const { result } = setup({
      title: dialogTitle,
      text: dialogText,
      action: dialogAction
    })

    const openDialog = result.current[1]

    expect(typeof result.current[0]).toBe('object')
    expect(typeof openDialog).toBe('function')

    act(openDialog)

    render(result.current[0])

    expect(screen.getByText(dialogTitle)).toBeInTheDocument()
    expect(screen.getByText(dialogText)).toBeInTheDocument()
    expect(screen.getByText(dialogAction)).toBeInTheDocument()
  })

  it('should invoke the onClose callback when when closing the dialog', async () => {
    const onClose = jest.fn()

    const { result } = setup({
      onClose
    })

    const openDialog = result.current[1]

    act(openDialog)

    render(result.current[0])

    act(() => screen.getByText('Cancel').click())

    expect(onClose).toHaveBeenCalled()
  })
})
