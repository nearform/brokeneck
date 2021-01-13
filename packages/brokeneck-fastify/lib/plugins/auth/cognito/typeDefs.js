'use strict'

const { default: gql } = require('graphql-tag')

const typeDefs = gql`
  extend type User {
    Username: ID!
    Enabled: Boolean
    UserStatus: String
    UserCreateDate: DateTime
    UserLastModifiedDate: DateTime
  }

  extend type Group {
    GroupName: ID!
    Description: String
    CreationDate: DateTime
    LastModifiedDate: DateTime
  }

  extend input UserInput {
    Username: String!
  }

  extend input EditUserInput {
    Enabled: Boolean
  }

  extend input GroupInput {
    GroupName: String!
    Description: String
  }

  extend input EditGroupInput {
    Description: String
  }
`

module.exports = typeDefs
