'use strict'

const { default: gql } = require('graphql-tag')

const typeDefs = gql`
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

  extend input EditUserInput {
    email: String!
  }

  extend input GroupInput {
    name: String!
    description: String
  }

  extend input EditGroupInput {
    name: String!
    description: String
  }
`

module.exports = typeDefs
