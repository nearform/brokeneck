'use strict'

const AWS = require('aws-sdk')

function CognitoProvider(options, logger) {
  const cognito = new AWS.CognitoIdentityServiceProvider({
    region: options.region
  })

  const UserPoolId = options.userPoolId

  return {
    meta: {
      name: 'cognito',
      capabilities: {
        canSearchGroups: false
      }
    },
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

      logger.debug({ user })

      return user
    },
    async listGroups({ pageSize, pageNumber }) {
      const result = await cognito
        .listGroups({
          UserPoolId,
          Limit: pageSize,
          NextToken: pageNumber || undefined
        })
        .promise()

      const groups = { data: result.Groups, nextPage: result.NextToken }

      logger.debug({ groups })

      return groups
    },
    async getGroup(id) {
      const group = await cognito
        .getGroup({
          UserPoolId,
          GroupName: id
        })
        .promise()

      logger.debug({ group })

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
    async editUser(id, input) {
      const { Enabled } = input

      if (Enabled) {
        await cognito
          .adminEnableUser({
            UserPoolId,
            Username: id
          })
          .promise()
      } else {
        await cognito
          .adminDisableUser({
            UserPoolId,
            Username: id
          })
          .promise()
      }

      return true
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
    async editGroup(id, input) {
      await cognito
        .updateGroup({
          UserPoolId,
          GroupName: id,
          ...input
        })
        .promise()
      return true
    },
    async listGroupsForUser(user) {
      const userGroups = await cognito
        .adminListGroupsForUser({
          UserPoolId,
          Username: user.Username
        })
        .promise()

      logger.debug({ userGroups })

      return userGroups.Groups
    },
    async listUsersForGroup({ group, pageSize, pageNumber }) {
      const result = await cognito
        .listUsersInGroup({
          UserPoolId,
          GroupName: group.GroupName,
          Limit: pageSize,
          NextToken: pageNumber || undefined
        })
        .promise()

      const groupUsers = { data: result.Users, nextPage: result.NextToken }

      logger.debug({ groupUsers })

      return groupUsers
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
