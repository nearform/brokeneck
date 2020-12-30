import React from 'react'
import T from 'prop-types'
import { List, ListItem, ListItemText } from '@material-ui/core'
import startCase from 'lodash.startcase'

import useFields from '../hooks/useFields'

export default function EntityFields({ typeName, data }) {
  const fields = useFields(typeName)

  return (
    <List>
      {fields.all.map(field => (
        <ListItem key={field}>
          <ListItemText
            primary={startCase(field)}
            secondary={fields.format(field, data[field])}
          ></ListItemText>
        </ListItem>
      ))}
    </List>
  )
}

EntityFields.propTypes = {
  typeName: T.string.isRequired,
  data: T.object
}
