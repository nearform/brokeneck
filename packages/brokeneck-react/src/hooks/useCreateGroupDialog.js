import { useMutation } from 'graphql-hooks'

import { CREATE_GROUP } from '../graphql'
import GraphQLError from '../GraphQLError'

import useDialog from './useDialog'
import useFields from './useFields'

export default function useCreateGroupDialog(onConfirm) {
  const inputFields = useFields('GroupInput')
  const groupFields = useFields('Group')
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
    text: 'Use this form to create a new group',
    action: 'Create',
    fields: inputFields.all.map(field => ({
      name: field,
      label: field,
      required: inputFields.metadata[field].required,
      type: inputFields.metadata[field].type
    }))
  })
}
