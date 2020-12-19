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
        const { pageSizeUsers, pageNumberUsers } = reply.request.body.variables

        return Promise.all(
          queries.map(({ obj }) =>
            fastify.provider.listUsersForGroup({
              group: obj,
              pageSize: pageSizeUsers,
              pageNumber: pageNumberUsers
            })
          )
        )
      }
    }
  }
}
