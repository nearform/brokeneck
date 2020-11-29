'use strict'

const fp = require('fastify-plugin')
const { default: gql } = require('graphql-tag')
const ManagementClient = require('auth0').ManagementClient

function Auth0Provider(options, logger) {
  const auth0 = new ManagementClient({
    domain: options.domain,
    clientId: options.clientId,
    clientSecret: options.clientSecret
  })

  return {
    name: 'auth0',
    async listUsers() {
      const users = await auth0.getUsers({})

      logger.debug({ users }, 'loaded users')

      return users
    },
    async getUser(id) {
      const user = await auth0.getUser({ id })

      logger.debug({ user })

      return user
    },
    async listGroups() {
      const groups = await auth0.getRoles()

      logger.debug({ groups })

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
    async listUsersForGroup(group) {
      const users = await auth0.getUsersInRole({ id: group.id })

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

async function auth0(fastify, options) {
  const logger = fastify.log.child({ module: 'auth0' })

  fastify.graphql.extendSchema(gql`
    extend type User {
      user_id: ID!
      email: String!
    }

    extend type Group {
      id: ID!
      name: String!
      description: String
    }

    extend input UserInput {
      email: String!
      password: String!
    }

    extend input GroupInput {
      name: String!
      description: String
    }
  `)

  fastify.decorate('provider', new Auth0Provider(options, logger))
}

module.exports = fp(auth0)
