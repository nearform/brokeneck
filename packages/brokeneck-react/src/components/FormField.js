import React from 'react'
import T from 'prop-types'
import { Box, Checkbox, FormControlLabel, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function FormField({
  // eslint-disable-next-line no-unused-vars
  field: { autocomplete, getValueFromObject, initialValue, ...field },
  handleChange,
  formValues
}) {
  if (autocomplete) {
    return <Autocomplete {...field} onChange={handleChange} />
  }

  switch (field.type) {
    case 'checkbox':
      return (
        <Box mb={1}>
          <FormControlLabel
            key={field.name}
            label={field.label}
            control={
              <Checkbox
                checked={formValues[field.name]}
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
            variant="outlined"
            size="small"
            onChange={handleChange}
            value={formValues[field.name]}
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
    initialValue: T.any,
    autocomplete: T.bool,
    getValueFromObject: T.func
  }).isRequired,
  handleChange: T.func.isRequired,
  formValues: T.object.isRequired
}
