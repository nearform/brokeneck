'use strict'

const ManagementClient = require('auth0').ManagementClient

function Auth0Provider(options, logger) {
  const auth0 = new ManagementClient({
    domain: options.domain,
    clientId: options.clientId,
    clientSecret: options.clientSecret
  })

  return {
    name: 'auth0',
    async listUsers({ pageNumber, pageSize, search }) {
      const page = pageNumber ? Number(pageNumber) - 1 : 0

      const data = await auth0.getUsers({
        page: page,
        per_page: pageSize,
        include_totals: true,
        q: search ? `name:*${search}*` : undefined
      })

      const users = {
        data: data.users,
        nextPage: data.length === data.limit ? (page + 2).toString() : ''
      }

      logger.debug({ users }, 'loaded users')

      return users
    },
    async getUser(id) {
      const user = await auth0.getUser({ id })

      logger.debug({ user })

      return user
    },
    async listGroups({ pageNumber, pageSize, search }) {
      const page = pageNumber ? Number(pageNumber) - 1 : 0

      const data = await auth0.getRoles({
        page: page,
        per_page: pageSize,
        include_totals: true,
        name_filter: search || undefined
      })

      const groups = {
        data: data.roles,
        nextPage: data.roles.length === data.limit ? (page + 2).toString() : ''
      }

      logger.debug({ groups }, 'loaded groups')

      return groups
    },
    async getGroup(id) {
      const group = await auth0.getRole({ id })

      logger.debug({ group })

      return group
    },
    async createUser(input) {
      const user = await auth0.createUser({
        connection: options.connection,
        ...input
      })

      logger.debug({ user })

      return user
    },
    async createGroup(input) {
      const group = await auth0.createRole(input)

      logger.debug({ group })

      return group
    },
    async listGroupsForUser(user) {
      const groups = await auth0.getUserRoles({ id: user.user_id })

      logger.debug({ groups })

      return groups
    },
    async listUsersForGroup({ group, pageSize, pageNumber }) {
      const page = pageNumber ? Number(pageNumber) - 1 : 0

      const data = await auth0.getUsersInRole({
        id: group.id,
        page,
        per_page: pageSize,
        include_totals: true
      })

      const users = {
        data: data.users,
        nextPage: data.users.length === data.limit ? (page + 2).toString() : ''
      }

      logger.debug({ users })

      return users
    },
    addUserToGroup({ userId, groupId }) {
      return auth0.assignRolestoUser({ id: userId }, { roles: [groupId] })
    },
    removeUserFromGroup({ userId, groupId }) {
      return auth0.removeRolesFromUser({ id: userId }, { roles: [groupId] })
    },
    deleteUser({ id }) {
      return auth0.deleteUser({ id })
    },
    deleteGroup({ id }) {
      return auth0.deleteRole({ id })
    }
  }
}

module.exports = Auth0Provider
