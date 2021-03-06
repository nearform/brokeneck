'use strict'

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require('graphql-iso-date')

module.exports = function makeResolvers(fastify) {
  return {
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
    Query: {
      users(_, { pageNumber, pageSize, search }) {
        return fastify.provider.listUsers({ pageNumber, pageSize, search })
      },
      user(_, { id }) {
        return fastify.provider.getUser(id)
      },
      groups(_, { pageNumber, pageSize, search }) {
        return fastify.provider.listGroups({ pageNumber, pageSize, search })
      },
      group(_, { id }) {
        return fastify.provider.getGroup(id)
      },
      provider() {
        return fastify.provider.meta
      }
    },
    Mutation: {
      createUser(_, { input }) {
        return fastify.provider.createUser(input)
      },
      editUser(_, { id, input }) {
        return fastify.provider.editUser(id, input)
      },
      createGroup(_, { input }) {
        return fastify.provider.createGroup(input)
      },
      editGroup(_, { id, input }) {
        return fastify.provider.editGroup(id, input)
      },
      async addUserToGroup(_, { input }) {
        await fastify.provider.addUserToGroup(input)
        return true
      },
      async removeUserFromGroup(_, { input }) {
        await fastify.provider.removeUserFromGroup(input)
        return true
      },
      async deleteUser(_, { input }) {
        await fastify.provider.deleteUser(input)
        return true
      },
      async deleteGroup(_, { input }) {
        await fastify.provider.deleteGroup(input)
        return true
      }
    }
  }
}
