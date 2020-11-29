'use strict'

module.exports = function makeLoaders(fastify) {
  return {
    User: {
      groups(queries) {
        return Promise.all(
          queries.map(({ obj }) => fastify.provider.listGroupsForUser(obj))
        )
      }
    },
    Group: {
      users(queries) {
        return Promise.all(
          queries.map(({ obj }) => fastify.provider.listUsersForGroup(obj))
        )
      }
    }
  }
}
