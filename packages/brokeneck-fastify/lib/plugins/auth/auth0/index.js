'use strict'

const fp = require('fastify-plugin')
const { default: gql } = require('graphql-tag')

const Auth0Provider = require('./provider')

async function auth0(fastify, options) {
  const logger = fastify.log.child({ module: 'auth0' })

  fastify.graphql.extendSchema(gql`
    extend type User {
      user_id: ID!
      email: String!
    }

    extend type Group {
      id: ID!
      name: String!
      description: String
    }

    extend input UserInput {
      email: String!
      password: String!
    }

    extend input GroupInput {
      name: String!
      description: String
    }
  `)

  fastify.decorate('provider', new Auth0Provider(options, logger))
}

module.exports = fp(auth0)
