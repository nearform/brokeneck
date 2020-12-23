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
      users(queries, { reply }) {
        return Promise.all(
          queries.map(({ obj }) =>
            fastify.provider.listUsersForGroup({
              group: obj,
              pageSize: reply.request.body.variables.pageSize,
              pageNumber: reply.request.body.variables.pageNumber
            })
          )
        )
      }
    }
  }
}
