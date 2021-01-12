'use strict'

const fp = require('fastify-plugin')
const msRestNodeAuth = require('@azure/ms-rest-nodeauth')

const AzureProvider = require('./provider')
const typeDefs = require('./typeDefs')

async function azure(fastify, options) {
  const logger = fastify.log.child({ module: 'azure' })

  fastify.graphql.extendSchema(typeDefs)

  const authResponse = await msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(
    options.clientId,
    options.secret,
    options.tenantId,
    {
      tokenAudience: 'graph'
    }
  )

  fastify.decorate(
    'provider',
    new AzureProvider(options, authResponse.credentials, logger)
  )
}

module.exports = fp(azure)
