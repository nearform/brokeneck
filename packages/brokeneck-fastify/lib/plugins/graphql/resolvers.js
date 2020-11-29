'use strict'

module.exports = function makeResolvers(fastify) {
  return {
    Query: {
      users() {
        return fastify.provider.listUsers()
      },
      user(_, { id }) {
        return fastify.provider.getUser(id)
      },
      groups() {
        return fastify.provider.listGroups()
      },
      group(_, { id }) {
        return fastify.provider.getGroup(id)
      },
      provider() {
        return fastify.provider.name
      }
    },
    Mutation: {
      createUser(_, { input }) {
        return fastify.provider.createUser(input)
      },
      createGroup(_, { input }) {
        return fastify.provider.createGroup(input)
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
