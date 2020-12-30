'use strict'

const fp = require('fastify-plugin')
const msRestNodeAuth = require('@azure/ms-rest-nodeauth')
const { default: gql } = require('graphql-tag')

const AzureProvider = require('./provider')

async function azure(fastify, options) {
  const logger = fastify.log.child({ module: 'azure' })

  fastify.graphql.extendSchema(gql`
    extend type User {
      objectId: ID!
      displayName: String!
      mailNickname: String!
      createdDateTime: DateTime
      accountEnabled: Boolean
    }

    extend type Group {
      objectId: ID!
      displayName: String!
      mailNickname: String!
    }

    extend input UserInput {
      displayName: String!
      userPrincipalName: String!
      mailNickname: String!
      password: String!
      accountEnabled: Boolean!
      forceChangePasswordNextLogin: Boolean!
    }

    extend input GroupInput {
      displayName: String!
      mailNickname: String!
    }
  `)

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
