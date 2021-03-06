import { useMutation } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import { CREATE_GROUP } from '../graphql'
import GraphQLError from '../GraphQLError'
import TYPES from '../types'

import useDialog from './useDialog'
import useFields from './useFields'

export default function useCreateGroupDialog(onConfirm) {
  const inputFields = useFields(TYPES.GroupInput)
  const groupFields = useFields(TYPES.Group)
  const [createGroup] = useMutation(CREATE_GROUP(groupFields.all))

  const handleConfirm = async input => {
    const { error } = await createGroup({
      variables: { input, skipErrorHandling: true }
    })

    if (error) {
      throw new GraphQLError(error)
    }

    onConfirm()
  }

  return useDialog({
    onConfirm: handleConfirm,
    title: 'Create group',
    action: 'Create',
    fields: inputFields.all.map(field => ({
      name: field,
      label: startCase(field),
      ...inputFields.metadata[field]
    }))
  })
}
