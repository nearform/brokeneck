import useSchema from './useSchema'

const CHECKBOX = 'checkbox'
const ID = 'ID'
const STRING = 'String'
const NON_NULL = 'NON_NULL'
const BOOLEAN = 'Boolean'

function getTypeName(field) {
  return field.type.ofType?.name || field.type.name
}

function getFormType(field) {
  if (getTypeName(field) === BOOLEAN) return CHECKBOX
  if (/password/i.test(field.name)) return 'password'

  return 'text'
}

const SUPPORTED_FIELD_TYPES = [
  ID,
  STRING,
  'Date',
  'Time',
  'DateTime',
  'Boolean'
]

export default function useFields(typeName) {
  const schema = useSchema(typeName)

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
    metadata
  }

  return fields
}
