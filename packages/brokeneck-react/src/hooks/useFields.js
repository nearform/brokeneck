import React from 'react'
import isNil from 'lodash.isnil'
import { useTheme } from '@material-ui/core/styles'

import CheckIcon from '../icons/check'
import CrossIcon from '../icons/cross'

import useSchema from './useSchema'

const CHECKBOX = 'checkbox'
const ID = 'ID'
const STRING = 'String'
const NON_NULL = 'NON_NULL'
const BOOLEAN = 'Boolean'

const SUPPORTED_FIELD_TYPES = [
  ID,
  STRING,
  'Date',
  'Time',
  'DateTime',
  'Boolean'
]

export const TYPE_NAMES = SUPPORTED_FIELD_TYPES.reduce(
  (acc, c) => ({ ...acc, [c]: c }),
  {}
)

function getTypeName(field) {
  return field.type.ofType?.name || field.type.name
}

function getFormType(field) {
  if (getTypeName(field) === BOOLEAN) return CHECKBOX
  if (/password/i.test(field.name)) return 'password'

  return 'text'
}

export default function useFields(typeName) {
  const schema = useSchema(typeName)
  const theme = useTheme()

  const allFields = [...(schema.fields || []), ...(schema.inputFields || [])]

  const firstStringField = allFields.find(
    field => getTypeName(field) === STRING
  )

  const id = allFields.find(field => getTypeName(field) === ID)

  const all = allFields.filter(field =>
    SUPPORTED_FIELD_TYPES.includes(getTypeName(field))
  )

  const metadata = all.reduce((acc, field) => {
    const type = getFormType(field)

    return {
      ...acc,
      [field.name]: {
        required: type !== CHECKBOX && field.type.kind === NON_NULL,
        type,
        initialValue: type === CHECKBOX ? false : ''
      }
    }
  }, {})

  const fieldMetadata = all.reduce((acc, field) => {
    return {
      ...acc,
      [field.name]: {
        typeName: getTypeName(field)
      }
    }
  }, {})

  // description is either the first string field, if mandatory, or the id
  // this is to cope with auth0 which has a non-readable id field and a mandatory additional field
  // and with cognito which has a readable id field but possibly other, non-mandatory string fields
  const description =
    firstStringField && metadata[firstStringField.name].required
      ? firstStringField
      : id

  const fields = {
    id: id?.name,
    description: description?.name,
    all: all.map(f => f.name),
    metadata,
    fieldMetadata,
    format: (field, value) => formatField(field, value, fieldMetadata, theme),
    isType(field, typeName) {
      return fieldMetadata[field].typeName === typeName
    }
  }

  return fields
}

function formatField(field, value, fieldMetadata, theme = { palette: {} }) {
  if (isNil(value)) {
    return '-'
  }

  const {
    palette: { success = {}, error = {} }
  } = theme

  switch (fieldMetadata[field].typeName) {
    case TYPE_NAMES.Boolean:
      return (
        <span role="img" aria-label={field}>
          {value ? (
            <CheckIcon fill={success.main} />
          ) : (
            <CrossIcon fill={error.main} />
          )}
        </span>
      )
    case TYPE_NAMES.Date:
      return new Date(value).toLocaleDateString()
    case TYPE_NAMES.Time:
      return new Date(value).toLocaleTimeString()
    case TYPE_NAMES.DateTime:
      return new Date(value).toLocaleString()
    default:
      return value
  }
}
