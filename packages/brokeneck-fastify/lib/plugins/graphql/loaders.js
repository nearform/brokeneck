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
      users(queries, res) {
        return Promise.all(
          queries.map(({ obj }) =>
            fastify.provider.listUsersForGroup({
              group: obj,
              pageSize: res?.reply.request.body.variables.pageSizeUsers,
              pageNumber: res?.reply.request.body.variables.pageNumberUsers
            })
          )
        )
      }
    }
  }
}
