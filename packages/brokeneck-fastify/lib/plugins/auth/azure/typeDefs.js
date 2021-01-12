'use strict'

const { default: gql } = require('graphql-tag')

const typeDefs = gql`
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

  extend input EditUserInput {
    displayName: String!
    accountEnabled: Boolean!
  }

  extend input GroupInput {
    displayName: String!
    mailNickname: String!
  }

  extend input EditGroupInput {
    displayName: String!
    mailNickname: String!
  }
`

module.exports = typeDefs
