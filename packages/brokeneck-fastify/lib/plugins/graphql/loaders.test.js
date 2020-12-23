'use strict'

const tap = require('tap')
const sinon = require('sinon')
const faker = require('faker')

const makeLoaders = require('./loaders')

tap.test('loaders', async t => {
  const fastify = {
    provider: {}
  }

  const loaders = makeLoaders(fastify)

  t.afterEach(async () => {
    sinon.restore()
  })

  t.test('User.groups', async t => {
    const groups = faker.random.arrayElements()
    const queries = groups.map(g => ({ obj: g }))

    fastify.provider.listGroupsForUser = sinon.stub()

    queries.forEach((q, i) => {
      fastify.provider.listGroupsForUser.withArgs(q.obj).resolves(groups[i])
    })

    const result = await loaders.User.groups(queries)

    t.deepEqual(result, groups)
  })

  t.test('Group.users', async t => {
    const users = faker.random.arrayElements()
    const queries = users.map(g => ({ obj: g }))

    fastify.provider.listUsersForGroup = sinon.stub()

    queries.forEach((q, i) => {
      fastify.provider.listUsersForGroup
        .withArgs({ group: q.obj, pageSize: undefined, pageNumber: undefined })
        .resolves(users[i])
    })

    const reply = {
      request: {
        body: {
          variables: {}
        }
      }
    }

    const result = await loaders.Group.users(queries, { reply })

    t.deepEqual(result, users)
  })
})
