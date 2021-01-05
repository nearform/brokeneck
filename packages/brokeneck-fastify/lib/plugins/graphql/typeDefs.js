'use strict'

const gql = require('graphql-tag')

const typeDefs = gql`
  scalar Ignored
  scalar Date
  scalar Time
  scalar DateTime

  type User {
    groups: [Group]!
  }

  type Group {
    users(pageNumber: String, pageSize: Int, search: String): PaginatedUsers!
  }

  input UserInput {
    _: Ignored
  }

  input GroupInput {
    _: Ignored
  }

  input EditUserInput {
    email: String
  }

  input EditGroupInput {
    name: String
    description: String
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

  type Capabilities {
    canSearchGroups: Boolean!
  }

  type Provider {
    name: String!
    capabilities: Capabilities!
  }

  type Query {
    users(pageNumber: String, pageSize: Int, search: String): PaginatedUsers
    user(id: String!): User
    groups(pageNumber: String, pageSize: Int, search: String): PaginatedGroups
    group(id: String!): Group
    provider: Provider!
  }

  type Mutation {
    createUser(input: UserInput!): User
    createGroup(input: GroupInput!): Group
    editUser(id: String!, input: EditUserInput!): User
    editGroup(id: String!, input: EditGroupInput!): Group
    addUserToGroup(input: AddUserToGroupInput!): Boolean
    removeUserFromGroup(input: RemoveUserFromGroupInput!): Boolean
    deleteUser(input: DeleteUserInput!): Boolean
    deleteGroup(input: DeleteGroupInput!): Boolean
  }
`

module.exports = typeDefs
