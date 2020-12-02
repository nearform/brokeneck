'use strict'

const envSchema = require('env-schema')
const S = require('fluent-schema')

const uiSchema = S.object()
  .prop('basename', S.string().default(''))
  .prop('serverUrl', S.string().default('/graphql'))

const pluginSchema = S.object()
  .prop('ui', S.oneOf([uiSchema, S.boolean()]).default(false))
  .prop('provider', S.string().enum(['auth0', 'cognito', 'azure']).required())
  .prop(
    'auth0',
    S.object()
      .prop('domain', S.string().required())
      .prop('clientId', S.string().required())
      .prop('clientSecret', S.string().required())
      .prop('connection', S.string().required())
  )
  .prop(
    'cognito',
    S.object()
      .prop('region', S.string().required())
      .prop('userPoolId', S.string().required())
  )
  .prop(
    'azure',
    S.object()
      .prop('tenantId', S.string().required())
      .prop('clientId', S.string().required())
      .prop('secret', S.string().required())
  )
  .ifThen(S.object().prop('provider', S.const('auth0')), S.required(['auth0']))
  .ifThen(
    S.object().prop('provider', S.const('cognito')),
    S.required(['cognito'])
  )
  .ifThen(S.object().prop('provider', S.const('azure')), S.required(['azure']))
  .prop('mercurius', S.object())

function validateConfig(data, schema) {
  return envSchema({
    data,
    schema: schema || pluginSchema
  })
}

module.exports = validateConfig
module.exports.uiSchema = uiSchema
