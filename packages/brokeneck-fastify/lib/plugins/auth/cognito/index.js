'use strict'

const fp = require('fastify-plugin')
const { default: gql } = require('graphql-tag')

const CognitoProvider = require('./provider')

async function cognito(fastify, options) {
  const logger = fastify.log.child({ module: 'cognito' })

  fastify.graphql.extendSchema(gql`
    extend type User {
      Username: ID!
    }

    extend type Group {
      GroupName: ID!
      Description: String
    }

    extend input UserInput {
      Username: String!
    }

    extend input GroupInput {
      GroupName: String!
      Description: String
    }
  `)

  fastify.decorate('provider', new CognitoProvider(options, logger))
}

module.exports = fp(cognito)
