'use strict'

const { GraphRbacManagementClient } = require('@azure/graph')

function AzureProvider(options, credentials, logger) {
  const azure = new GraphRbacManagementClient(credentials, options.tenantId)

  return {
    name: 'azure',
    async listUsers() {
      const users = await azure.users.list()

      logger.debug({ users }, 'loaded users')

      return users
    },
    async getUser(id) {
      const user = await azure.users.get(id)

      logger.debug({ user }, 'loaded user')

      return user
    },
    async listGroups() {
      const groups = await azure.groups.list()

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
    createGroup(input) {
      return azure.groups.create(input)
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
    async listUsersForGroup(group) {
      const groupUsers = await azure.groups.getGroupMembers(group.objectId)

      logger.debug({ groupUsers }, 'loaded users for group')

      return groupUsers
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
