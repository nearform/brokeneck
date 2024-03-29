'use strict'

const tap = require('tap')
const sinon = require('sinon')
const faker = require('faker')

const makeResolvers = require('./resolvers')

tap.test('resolvers', async t => {
  const fastify = {
    provider: {}
  }

  const resolvers = makeResolvers(fastify)

  t.afterEach(async () => {
    sinon.restore()
  })

  t.test('Query', async t => {
    t.test('users', async t => {
      const users = faker.random.arrayElements()

      fastify.provider.listUsers = sinon.stub().resolves(users)

      const args = {
        pageNumber: 1,
        pageSize: 2,
        search: 'search'
      }
      const result = await resolvers.Query.users(null, args)

      sinon.assert.calledWith(fastify.provider.listUsers, args)

      t.equal(result, users)
    })

    t.test('user', async t => {
      const id = faker.datatype.uuid()
      const user = { id }

      fastify.provider.getUser = sinon.stub().resolves(user)

      const result = await resolvers.Query.user(null, { id })

      t.equal(result, user)

      sinon.assert.calledOnceWithMatch(fastify.provider.getUser, id)
    })

    t.test('groups', async t => {
      const groups = faker.random.arrayElements()

      fastify.provider.listGroups = sinon.stub().resolves(groups)

      const args = {
        pageNumber: 1,
        pageSize: 2,
        search: 'search'
      }
      const result = await resolvers.Query.groups(null, args)

      sinon.assert.calledWith(fastify.provider.listGroups, args)

      t.equal(result, groups)
    })

    t.test('group', async t => {
      const id = faker.datatype.uuid()
      const group = { id }

      fastify.provider.getGroup = sinon.stub().resolves(group)

      const result = await resolvers.Query.group(null, { id })

      t.equal(result, group)

      sinon.assert.calledOnceWithMatch(fastify.provider.getGroup, id)
    })

    t.test('provider', async t => {
      const name = faker.random.word()

      fastify.provider.meta = { name }

      const result = await resolvers.Query.provider()

      t.same(result, { name })
    })
  })

  t.test('Mutation', async t => {
    t.test('createUser', async t => {
      const user = { id: faker.datatype.uuid() }

      fastify.provider.createUser = sinon.stub().resolves(user)

      const result = await resolvers.Mutation.createUser(null, { input: user })

      t.equal(result, user)
      sinon.assert.calledWith(fastify.provider.createUser, user)
    })

    t.test('editUser', async t => {
      const id = faker.datatype.uuid()
      const input = { property: faker.random.word() }

      fastify.provider.editUser = sinon.stub().resolves()

      await resolvers.Mutation.editUser(null, { id, input })

      sinon.assert.calledWith(fastify.provider.editUser, id, input)
    })

    t.test('createGroup', async t => {
      const group = { id: faker.datatype.uuid() }

      fastify.provider.createGroup = sinon.stub().resolves(group)

      const result = await resolvers.Mutation.createGroup(null, {
        input: group
      })

      t.equal(result, group)
      sinon.assert.calledWith(fastify.provider.createGroup, group)
    })

    t.test('editGroup', async t => {
      const id = faker.datatype.uuid()
      const input = { property: faker.random.word() }

      fastify.provider.editGroup = sinon.stub().resolves()

      await resolvers.Mutation.editGroup(null, { id, input })

      sinon.assert.calledWith(fastify.provider.editGroup, id, input)
    })

    t.test('addUserToGroup', async t => {
      const input = { id: faker.datatype.uuid() }

      fastify.provider.addUserToGroup = sinon.stub().resolves(input)

      const result = await resolvers.Mutation.addUserToGroup(null, {
        input
      })

      t.equal(result, true)
      sinon.assert.calledWith(fastify.provider.addUserToGroup, input)
    })

    t.test('removeUserFromGroup', async t => {
      const input = { id: faker.datatype.uuid() }

      fastify.provider.removeUserFromGroup = sinon.stub().resolves(input)

      const result = await resolvers.Mutation.removeUserFromGroup(null, {
        input
      })

      t.equal(result, true)
      sinon.assert.calledWith(fastify.provider.removeUserFromGroup, input)
    })

    t.test('deleteUser', async t => {
      const input = { id: faker.datatype.uuid() }

      fastify.provider.deleteUser = sinon.stub().resolves(input)

      const result = await resolvers.Mutation.deleteUser(null, {
        input
      })

      t.equal(result, true)
      sinon.assert.calledWith(fastify.provider.deleteUser, input)
    })

    t.test('deleteGroup', async t => {
      const input = { id: faker.datatype.uuid() }

      fastify.provider.deleteGroup = sinon.stub().resolves(input)

      const result = await resolvers.Mutation.deleteGroup(null, {
        input
      })

      t.equal(result, true)
      sinon.assert.calledWith(fastify.provider.deleteGroup, input)
    })
  })
})
