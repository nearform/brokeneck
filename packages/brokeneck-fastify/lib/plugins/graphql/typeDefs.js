'use strict'

const gql = require('graphql-tag')

const typeDefs = gql`
  scalar Ignored

  type User {
    groups: [Group]!
  }

  type Group {
    users: PaginatedUsers!
  }

  input UserInput {
    _: Ignored
  }

  input GroupInput {
    _: Ignored
  }

  input AddUserToGroupInput {
    userId: String!
    groupId: String!
  }

  input RemoveUserFromGroupInput {
    userId: String!
    groupId: String!
  }

  input DeleteUserInput {
    id: String!
  }

  input DeleteGroupInput {
    id: String!
  }

  type PaginatedUsers {
    data: [User]!
    nextPage: String
  }

  type PaginatedGroups {
    data: [Group]!
    nextPage: String
  }

  type Query {
    users(pageNumber: String, pageSize: Int, search: String): PaginatedUsers
    user(id: String!): User
    groups(pageNumber: String, pageSize: Int): PaginatedGroups
    group(id: String!, pageNumberUsers: String, pageSizeUsers: Int): Group
    provider: String!
  }

  type Mutation {
    createUser(input: UserInput!): User
    createGroup(input: GroupInput!): Group
    addUserToGroup(input: AddUserToGroupInput!): Boolean
    removeUserFromGroup(input: RemoveUserFromGroupInput!): Boolean
    deleteUser(input: DeleteUserInput!): Boolean
    deleteGroup(input: DeleteGroupInput!): Boolean
  }
`

module.exports = typeDefs
