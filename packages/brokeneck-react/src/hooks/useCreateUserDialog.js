import { useMutation } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import { CREATE_USER } from '../graphql'
import GraphQLError from '../GraphQLError'
import TYPES from '../types'

import useDialog from './useDialog'
import useFields from './useFields'

export default function useCreateUserDialog(onConfirm) {
  const inputFields = useFields(TYPES.UserInput)
  const userFields = useFields(TYPES.User)
  const [createUser] = useMutation(CREATE_USER(userFields.all))

  const handleConfirm = async input => {
    const { error } = await createUser({
      variables: { input, skipErrorHandling: true }
    })

    if (error) {
      throw new GraphQLError(error)
    }

    onConfirm()
  }

  return useDialog({
    onConfirm: handleConfirm,
    title: 'Create user',
    action: 'Create',
    fields: inputFields.all.map(field => ({
      name: field,
      label: startCase(field),
      ...inputFields.metadata[field]
    }))
  })
}
