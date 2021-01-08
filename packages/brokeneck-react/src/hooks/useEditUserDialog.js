import { useMutation } from 'graphql-hooks'

import { EDIT_USER } from '../graphql'
import GraphQLError from '../GraphQLError'

import useDialogFormik from './useDialogFormik'
import useFields from './useFields'

export default function useEditUserDialog(userData, onConfirm) {
  const userFields = useFields('User')
  const [editUser] = useMutation(EDIT_USER(userFields.all))

  const handleSubmit = async input => {
    const { error } = await editUser({
      variables: { input, skipErrorHandling: true }
    })

    if (error) {
      throw new GraphQLError(error)
    }

    onConfirm()
  }

  return useDialogFormik({
    title: 'Edit user',
    text: 'Use this form to edit a user',
    action: 'Edit',
    fields: userData.user,
    handleSubmit
  })
}
