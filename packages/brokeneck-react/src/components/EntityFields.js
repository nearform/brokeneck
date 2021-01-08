import React, { useState } from 'react'
import T from 'prop-types'
import { List, ListItem, ListItemText, TextField } from '@material-ui/core'
import startCase from 'lodash.startcase'
import EditIcon from '@material-ui/icons/Edit'
import { useFormik } from 'formik'

import useFields from '../hooks/useFields'

export default function EntityFields({ typeName, data, editHandler }) {
  const fields = useFields(typeName)

  return (
    <List>
      {fields.all.map(field =>
        EditableListItem(
          field,
          fields.format(field, data[field]),
          fields.id,
          editHandler
        )
      )}
    </List>
  )
}

const EditableListItem = (field, val, id, editHandler) => {
  const [editing, setEditing] = useState(false)

  const watchKeys = e => {
    if (e.keyCode === 13) formik.handleSubmit()
  }

  const formik = useFormik({
    initialValues: {
      [field]: val
    },
    onSubmit: values => {
      setEditing(!editing)
      editHandler(values)
    }
  })

  return (
    <ListItem key={field}>
      {editing ? (
        <TextField
          label={startCase(field)}
          name={field}
          value={formik.values[field]}
          onKeyUp={watchKeys}
          onChange={formik.handleChange}
          onBlur={formik.handleSubmit}
          fullWidth
          variant="outlined"
          size="small"
        ></TextField>
      ) : id !== field ? (
        <>
          <ListItemText
            primary={startCase(field)}
            secondary={formik.values[field]}
            onClick={() => setEditing(!editing)}
          ></ListItemText>
          <EditIcon />
        </>
      ) : (
        <ListItemText primary={startCase(field)} secondary={val}></ListItemText>
      )}
    </ListItem>
  )
}

EntityFields.propTypes = {
  typeName: T.string.isRequired,
  data: T.object,
  editHandler: T.func
}
