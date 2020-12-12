import React, { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation } from 'graphql-hooks'
import { CircularProgress, TextField } from '@material-ui/core'
import startCase from 'lodash.startcase'
import debounce from 'lodash.debounce'

import { ADD_USER_TO_GROUP, LOAD_USERS } from '../graphql'
import GraphQLError from '../GraphQLError'

import useDialog from './useDialog'
import useFields from './useFields'

export default function useAddUsersToGroupDialog(groupId, onConfirm) {
  const userFields = useFields('User')
  const [search, setSearch] = useState()

  const debouncedSetSearch = useMemo(() => debounce(setSearch, 500), [
    setSearch
  ])

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch])

  const { data, loading } = useQuery(LOAD_USERS(userFields.all), {
    variables: {
      search
    }
  })
  const [addUserToGroup] = useMutation(ADD_USER_TO_GROUP)

  const handleConfirm = async input => {
    const { error } = await addUserToGroup({
      variables: {
        input: { userId: input[userFields.id], groupId },
        skipErrorHandling: true
      }
    })

    if (error) {
      throw new GraphQLError(error)
    }

    onConfirm()
  }

  function handleAutocompleteChange(e, search) {
    debouncedSetSearch(search)
  }

  return useDialog({
    onConfirm: handleConfirm,
    title: `Add users to group ${groupId}`,
    text: 'Use this form to add users to a group',
    action: 'Add to group',
    fields: [
      {
        name: userFields.id,
        label: startCase(userFields.description),
        autocomplete: true,
        options: data?.users.data || [],
        getOptionLabel: option => option[userFields.description],
        loading,
        renderInput: function Input(params) {
          // eslint-disable-next-line no-unused-vars
          const { initialValue, ...metadata } = userFields.metadata[
            userFields.id
          ]

          return (
            <TextField
              {...params}
              {...metadata}
              label={startCase(userFields.description)}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )
        },
        ...userFields.metadata[userFields.id],
        getValueFromObject: o => o[userFields.id],
        onInputChange: handleAutocompleteChange
      }
    ]
  })
}
