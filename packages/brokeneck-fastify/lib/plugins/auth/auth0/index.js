'use strict'

const fp = require('fastify-plugin')

const Auth0Provider = require('./provider')
const typeDefs = require('./typeDefs')

async function auth0(fastify, options) {
  const logger = fastify.log.child({ module: 'auth0' })

  fastify.graphql.extendSchema(typeDefs)

  fastify.decorate('provider', new Auth0Provider(options, logger))
}

module.exports = fp(auth0)
