import { useRef } from 'react'

import useDialog from './useDialog'

export default function useConfirmDialog(props) {
  const resolveRef = useRef()

  const [dialog, openDialog] = useDialog({
    onConfirm: () => {
      resolveRef.current(true)
    },
    onClose: () => {
      resolveRef.current(false)
    },
    ...props
  })

  return [
    dialog,
    () => {
      openDialog()
      return new Promise(resolve => {
        resolveRef.current = resolve
      })
    }
  ]
}
