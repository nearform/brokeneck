'use strict'

const fp = require('fastify-plugin')

const CognitoProvider = require('./provider')
const typeDefs = require('./typeDefs')

async function cognito(fastify, options) {
  const logger = fastify.log.child({ module: 'cognito' })

  fastify.graphql.extendSchema(typeDefs)

  fastify.decorate('provider', new CognitoProvider(options, logger))
}

module.exports = fp(cognito)
