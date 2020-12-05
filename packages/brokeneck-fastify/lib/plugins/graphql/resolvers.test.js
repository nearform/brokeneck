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

      const result = await resolvers.Query.users()

      t.equal(result, users)
    })

    t.test('user', async t => {
      const id = faker.random.uuid()
      const user = { id }

      fastify.provider.getUser = sinon.stub().resolves(user)

      const result = await resolvers.Query.user(null, { id })

      t.equal(result, user)

      sinon.assert.calledOnceWithMatch(fastify.provider.getUser, id)
    })

    t.test('groups', async t => {
      const groups = faker.random.arrayElements()

      fastify.provider.listGroups = sinon.stub().resolves(groups)

      const result = await resolvers.Query.groups()

      t.equal(result, groups)
    })

    t.test('group', async t => {
      const id = faker.random.uuid()
      const group = { id }

      fastify.provider.getGroup = sinon.stub().resolves(group)

      const result = await resolvers.Query.group(null, { id })

      t.equal(result, group)

      sinon.assert.calledOnceWithMatch(fastify.provider.getGroup, id)
    })

    t.test('name', async t => {
      const name = faker.random.word()

      fastify.provider.name = name

      const result = await resolvers.Query.provider()

      t.equal(result, name)
    })
  })

  t.test('Mutation', async t => {
    t.test('createUser', async t => {
      const user = { id: faker.random.uuid() }

      fastify.provider.createUser = sinon.stub().resolves(user)

      const result = await resolvers.Mutation.createUser(null, { input: user })

      t.equal(result, user)
      sinon.assert.calledWith(fastify.provider.createUser, user)
    })

    t.test('createGroup', async t => {
      const group = { id: faker.random.uuid() }

      fastify.provider.createGroup = sinon.stub().resolves(group)

      const result = await resolvers.Mutation.createGroup(null, {
        input: group
      })

      t.equal(result, group)
      sinon.assert.calledWith(fastify.provider.createGroup, group)
    })

    t.test('addUserToGroup', async t => {
      const input = { id: faker.random.uuid() }

      fastify.provider.addUserToGroup = sinon.stub().resolves(input)

      const result = await resolvers.Mutation.addUserToGroup(null, {
        input
      })

      t.equal(result, true)
      sinon.assert.calledWith(fastify.provider.addUserToGroup, input)
    })

    t.test('removeUserFromGroup', async t => {
      const input = { id: faker.random.uuid() }

      fastify.provider.removeUserFromGroup = sinon.stub().resolves(input)

      const result = await resolvers.Mutation.removeUserFromGroup(null, {
        input
      })

      t.equal(result, true)
      sinon.assert.calledWith(fastify.provider.removeUserFromGroup, input)
    })

    t.test('deleteUser', async t => {
      const input = { id: faker.random.uuid() }

      fastify.provider.deleteUser = sinon.stub().resolves(input)

      const result = await resolvers.Mutation.deleteUser(null, {
        input
      })

      t.equal(result, true)
      sinon.assert.calledWith(fastify.provider.deleteUser, input)
    })

    t.test('deleteGroup', async t => {
      const input = { id: faker.random.uuid() }

      fastify.provider.deleteGroup = sinon.stub().resolves(input)

      const result = await resolvers.Mutation.deleteGroup(null, {
        input
      })

      t.equal(result, true)
      sinon.assert.calledWith(fastify.provider.deleteGroup, input)
    })
  })
})
