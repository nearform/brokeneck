import React from 'react'
import T from 'prop-types'
import { Box, Checkbox, FormControlLabel, TextField } from '@material-ui/core'

export default function FormField({
  field: { initialValue, ...field },
  handleChange,
  formValues
}) {
  switch (field.type) {
    case 'checkbox':
      return (
        <Box mb={1}>
          <FormControlLabel
            key={field.name}
            label={field.label}
            control={
              <Checkbox
                checked={
                  field.name in formValues
                    ? formValues[field.name]
                    : initialValue
                }
                onChange={handleChange}
                {...field}
              />
            }
          />
        </Box>
      )
    default:
      return (
        <Box mb={1}>
          <TextField
            key={field.name}
            autoComplete="off"
            fullWidth
            margin="dense"
            onChange={handleChange}
            value={
              field.name in formValues ? formValues[field.name] : initialValue
            }
            {...field}
          />
        </Box>
      )
  }
}

FormField.propTypes = {
  field: T.shape({
    name: T.string.isRequired,
    label: T.string.isRequired,
    type: T.string.isRequired,
    initialValue: T.any.isRequired
  }).isRequired,
  handleChange: T.func.isRequired,
  formValues: T.object.isRequired
}
