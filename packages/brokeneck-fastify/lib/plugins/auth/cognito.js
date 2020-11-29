'use strict'

const fp = require('fastify-plugin')
const AWS = require('aws-sdk')
const { default: gql } = require('graphql-tag')

function CognitoProvider(options, logger) {
  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: options.region
  })

  const UserPoolId = options.userPoolId

  return {
    name: 'cognito',
    async listUsers() {
      const result = await cognito
        .listUsers({
          UserPoolId
        })
        .promise()

      const users = result.Users

      logger.debug({ users })

      return users
    },
    async getUser(id) {
      const user = await cognito
        .adminGetUser({
          UserPoolId,
          Username: id
        })
        .promise()

      return user
    },
    async listGroups() {
      const result = await cognito
        .listGroups({
          UserPoolId
        })
        .promise()

      return result.Groups
    },
    async getGroup(id) {
      const group = await cognito
        .getGroup({
          UserPoolId,
          GroupName: id
        })
        .promise()

      return group.Group
    },
    async createUser(input) {
      const result = await cognito
        .adminCreateUser({
          UserPoolId,
          ...input
        })
        .promise()

      return result.User
    },
    async createGroup(input) {
      const result = await cognito
        .createGroup({
          UserPoolId,
          ...input
        })
        .promise()

      return result.Group
    },
    async listGroupsForUser(user) {
      const userGroups = await cognito
        .adminListGroupsForUser({
          UserPoolId,
          Username: user.Username
        })
        .promise()

      return userGroups.Groups
    },
    async listUsersForGroup(group) {
      const groupUsers = await cognito
        .listUsersInGroup({
          UserPoolId,
          GroupName: group.GroupName
        })
        .promise()

      return groupUsers.Users
    },
    addUserToGroup({ userId, groupId }) {
      return cognito
        .adminAddUserToGroup({
          UserPoolId,
          Username: userId,
          GroupName: groupId
        })
        .promise()
    },
    removeUserFromGroup({ userId, groupId }) {
      return cognito
        .adminRemoveUserFromGroup({
          UserPoolId,
          Username: userId,
          GroupName: groupId
        })
        .promise()
    },
    deleteUser({ id }) {
      return cognito
        .adminDeleteUser({
          UserPoolId,
          Username: id
        })
        .promise()
    },
    deleteGroup({ id }) {
      return cognito
        .deleteGroup({
          UserPoolId,
          GroupName: id
        })
        .promise()
    }
  }
}
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
