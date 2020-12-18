'use strict'

const AWS = require('aws-sdk')

function CognitoProvider(options, logger) {
  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: options.region
  })

  const UserPoolId = options.userPoolId

  return {
    name: 'cognito',
    async listUsers({ pageNumber, pageSize, search }) {
      const result = await cognito
        .listUsers({
          UserPoolId,
          Limit: pageSize,
          PaginationToken: pageNumber || undefined,
          Filter: search ? `username ^= "${search}"` : undefined
        })
        .promise()

      const users = { data: result.Users, nextPage: result.PaginationToken }

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
    async listGroups({ pageNumber, pageSize, search }) {
      const result = await cognito
        .listGroups({
          Limit: pageSize,
          // NextToken:
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

module.exports = CognitoProvider
