import useSchema from './useSchema'

function getFieldTypeName(field) {
  return field.type.ofType?.name || field.type.name
}

const CHECKBOX = 'checkbox'

function getMetadataFieldType(field) {
  if (getFieldTypeName(field) === 'Boolean') return CHECKBOX
  if (/password/i.test(field.name)) return 'password'

  return 'text'
}

export default function useFields(typeName) {
  const schema = useSchema(typeName)

  const strings = [
    ...(schema.fields || []),
    ...(schema.inputFields || [])
  ].filter(field => ['String'].includes(getFieldTypeName(field)))

  const booleans = [
    ...(schema.fields || []),
    ...(schema.inputFields || [])
  ].filter(field => ['Boolean'].includes(getFieldTypeName(field)))

  const id = (schema.fields || []).find(
    field => getFieldTypeName(field) === 'ID'
  )

  const all = [id, ...strings, ...booleans].filter(Boolean)

  const metadata = all.reduce((acc, field) => {
    const type = getMetadataFieldType(field)

    return {
      ...acc,
      [field.name]: {
        required: type !== CHECKBOX && field.type.kind === 'NON_NULL',
        type,
        initialValue: type === CHECKBOX ? false : ''
      }
    }
  }, {})

  // description is either the first string field, if mandatory, or the id
  // this is to cope with auth0 which has a non-readable id field and a mandatory additional field
  // and with cognito which has a readable id field but possibly other, non-mandatory string fields
  const description =
    strings[0] && metadata[strings[0].name].required ? strings[0] : id

  const fields = {
    id: id?.name,
    description: description?.name,
    all: all.map(f => f.name),
    metadata
  }

  return fields
}
