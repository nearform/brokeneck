import { useMemo } from 'react'
import { useMutation } from 'graphql-hooks'
import startCase from 'lodash.startcase'

import GraphQLError from '../GraphQLError'

import useDialog from './useDialog'
import useFields from './useFields'

export default function useEditEntityDialog(
  id,
  entity,
  onConfirm,
  editTypeName,
  typeName,
  mutationFactory
) {
  const inputFields = useFields(editTypeName, entity)
  const groupFields = useFields(typeName)
  const [editEntity] = useMutation(mutationFactory(groupFields.all))

  const handleConfirm = async input => {
    const { error } = await editEntity({
      variables: { id, input, skipErrorHandling: true }
    })

    if (error) {
      throw new GraphQLError(error)
    }

    onConfirm()
  }

  const fields = useMemo(
    () =>
      inputFields.all.map(field => ({
        name: field,
        label: startCase(field),
        ...inputFields.metadata[field]
      })),
    [inputFields.all, inputFields.metadata]
  )

  return useDialog({
    onConfirm: handleConfirm,
    title: `Edit ${typeName}`,
    action: 'Save',
    fields
  })
}
