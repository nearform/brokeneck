'use strict'

const { GraphRbacManagementClient } = require('@azure/graph')

const {
  listUsersNextOperationSpec,
  listUsersOperationSpec,
  listGroupsOperationSpec,
  listGroupsNextOperationSpec,
  listGroupsUsersOperationSpec,
  listGroupsUsersNextOperationSpec
} = require('./operations')

function AzureProvider(options, credentials, logger) {
  const azure = new GraphRbacManagementClient(credentials, options.tenantId)

  return {
    meta: {
      name: 'azure',
      capabilities: {
        canSearchGroups: false
      }
    },
    async listUsers({ pageNumber, pageSize, search }) {
      const options = { top: pageSize, search: `"displayName:${search}"` }

      const result = await (pageNumber
        ? azure.sendOperationRequest(
            {
              nextLink: pageNumber,
              options
            },
            listUsersNextOperationSpec
          )
        : azure.sendOperationRequest({ options }, listUsersOperationSpec))

      const users = { data: result, nextPage: result.odatanextLink }

      logger.debug({ users }, 'loaded users')

      return users
    },
    async getUser(id) {
      const user = await azure.users.get(id)

      logger.debug({ user }, 'loaded user')

      return user
    },
    async listGroups({ pageNumber, pageSize }) {
      const options = { top: pageSize }

      const result = await (pageNumber
        ? azure.sendOperationRequest(
            {
              nextLink: pageNumber,
              options
            },
            listGroupsNextOperationSpec
          )
        : azure.sendOperationRequest({ options }, listGroupsOperationSpec))

      const groups = { data: result, nextPage: result.odatanextLink }

      logger.debug({ groups }, 'loaded groups')

      return groups
    },
    async getGroup(id) {
      const group = await azure.groups.get(id)

      logger.debug({ group }, 'loaded group')

      return group
    },
    createUser({ password, forceChangePasswordNextLogin, ...input }) {
      return azure.users.create({
        ...input,
        accountEnabled: !!input.accountEnabled,
        passwordProfile: {
          password,
          forceChangePasswordNextLogin: !!forceChangePasswordNextLogin
        }
      })
    },
    async editUser(id, input) {
      await azure.users.update(id, input)
      return true
    },
    createGroup(input) {
      return azure.groups.create(input)
    },
    async editGroup(id, input) {
      await azure.groups.update(id, input)
      return true
    },
    async listGroupsForUser(user) {
      const userGroupsIds = await azure.users.getMemberGroups(user.objectId, {
        securityEnabledOnly: false
      })

      logger.debug({ userGroupsIds }, 'loaded groups for user')

      return Promise.all(
        userGroupsIds.map(groupId => azure.groups.get(groupId))
      )
    },
    async listUsersForGroup({ group, pageSize, pageNumber }) {
      const options = { top: pageSize }

      const result = await (pageNumber
        ? azure.sendOperationRequest(
            {
              nextLink: pageNumber,
              options
            },
            listGroupsUsersNextOperationSpec
          )
        : azure.sendOperationRequest(
            { groupId: group.objectId, options },
            listGroupsUsersOperationSpec
          ))

      const users = { data: result, nextPage: result.odatanextLink }

      logger.debug({ users }, "loaded group's users")

      return users
    },
    addUserToGroup({ userId, groupId }) {
      const userUrl = `https://graph.windows.net/${options.tenantId}/directoryObjects/${userId}`

      return azure.groups.addMember(groupId, {
        url: userUrl
      })
    },
    removeUserFromGroup({ userId, groupId }) {
      return azure.groups.removeMember(groupId, userId)
    },
    deleteUser({ id }) {
      return azure.users.deleteMethod(id)
    },
    deleteGroup({ id }) {
      return azure.groups.deleteMethod(id)
    }
  }
}

module.exports = AzureProvider
