import { useMutation } from 'graphql-hooks'

import { EDIT_GROUP } from '../graphql'
import GraphQLError from '../GraphQLError'

import useDialogFormik from './useDialogFormik'
import useFields from './useFields'

export default function useEditGroupDialog(groupData, onConfirm) {
  const groupFields = useFields('Group')
  const [editGroup] = useMutation(EDIT_GROUP(groupFields.all))

  const formData = {}
  groupFields.all.map(field => {
    if (field !== groupFields.id) formData[field] = groupData[field]
  })

  const handleSubmit = async input => {
    const { error } = await editGroup({
      variables: {
        id: groupData[groupFields.id],
        input,
        skipErrorHandling: true
      }
    })

    if (error) {
      throw new GraphQLError(error)
    }

    onConfirm()
  }

  return useDialogFormik({
    title: 'Edit user',
    text: `Use this form to edit the group ${groupData[groupFields.id]}`,
    action: 'Edit',
    fields: formData,
    handleSubmit
  })
}
