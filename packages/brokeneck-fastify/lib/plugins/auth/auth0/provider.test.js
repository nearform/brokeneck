'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const faker = require('faker')

tap.test('auth0 provider', async t => {
  const auth0 = {}

  const Auth0Provider = proxyquire('./provider', {
    auth0: {
      ManagementClient: function () {
        return auth0
      }
    }
  })

  const provider = new Auth0Provider({}, { debug: sinon.stub() })

  t.afterEach(async () => {
    sinon.restore()
  })

  t.test('returns the name', async t => {
    t.equal(provider.name, 'auth0')
  })

  t.test('returns users', async t => {
    const users = faker.random.arrayElements()
    auth0.getUsers = sinon.stub().resolves(users)

    const result = await provider.listUsers()

    t.equal(result, users)
  })

  t.test('returns user', async t => {
    const id = faker.random.uuid()
    const user = { id }

    auth0.getUser = sinon.stub().resolves(user)

    const result = await provider.getUser(id)

    t.equal(result, user)

    sinon.assert.calledWith(auth0.getUser, sinon.match({ id }))
  })

  t.test('returns groups', async t => {
    const groups = faker.random.arrayElements()
    auth0.getRoles = sinon.stub().resolves(groups)

    const result = await provider.listGroups()

    t.equal(result, groups)
  })

  t.test('returns group', async t => {
    const id = faker.random.uuid()
    const group = { id }

    auth0.getRole = sinon.stub().resolves(group)

    const result = await provider.getGroup(id)

    t.equal(result, group)

    sinon.assert.calledWith(auth0.getRole, sinon.match({ id }))
  })

  t.test('creates user', async t => {
    const username = faker.random.uuid()
    const user = { username }

    auth0.createUser = sinon.stub().resolves(user)

    const result = await provider.createUser(user)

    t.equal(result, user)

    sinon.assert.calledWith(auth0.createUser, sinon.match(user))
  })

  t.test('creates group', async t => {
    const groupName = faker.random.uuid()
    const group = { groupName }

    auth0.createRole = sinon.stub().resolves(group)

    const result = await provider.createGroup(group)

    t.equal(result, group)

    sinon.assert.calledWith(auth0.createRole, sinon.match(group))
  })

  t.test('lists groups for user', async t => {
    const userId = faker.random.uuid()
    const user = { user_id: userId }
    const groups = faker.random.arrayElements()

    auth0.getUserRoles = sinon.stub().resolves(groups)

    const result = await provider.listGroupsForUser(user)

    t.equal(result, groups)

    sinon.assert.calledWith(auth0.getUserRoles, sinon.match({ id: userId }))
  })

  t.test('lists users for group', async t => {
    const groupId = faker.random.uuid()
    const group = { id: groupId }
    const users = faker.random.arrayElements()

    auth0.getUsersInRole = sinon.stub().resolves(users)

    const result = await provider.listUsersForGroup(group)

    t.equal(result, users)

    sinon.assert.calledWith(auth0.getUsersInRole, sinon.match(group))
  })

  t.test('add user to group', async t => {
    const userId = faker.random.uuid()
    const groupId = faker.random.uuid()

    auth0.assignRolestoUser = sinon.stub().resolves()

    await provider.addUserToGroup({ userId, groupId })

    sinon.assert.calledWith(
      auth0.assignRolestoUser,
      sinon.match({ id: userId }),
      sinon.match({ roles: [groupId] })
    )
  })

  t.test('remove user from group', async t => {
    const userId = faker.random.uuid()
    const groupId = faker.random.uuid()

    auth0.removeRolesFromUser = sinon.stub().resolves()

    await provider.removeUserFromGroup({ userId, groupId })

    sinon.assert.calledWith(
      auth0.removeRolesFromUser,
      sinon.match({ id: userId }),
      sinon.match({ roles: [groupId] })
    )
  })

  t.test('delete user', async t => {
    const id = faker.random.uuid()

    auth0.deleteUser = sinon.stub().resolves()

    await provider.deleteUser({ id })

    sinon.assert.calledWith(auth0.deleteUser, sinon.match({ id }))
  })

  t.test('delete group', async t => {
    const id = faker.random.uuid()

    auth0.deleteRole = sinon.stub().resolves()

    await provider.deleteGroup({ id })

    sinon.assert.calledWith(auth0.deleteRole, sinon.match({ id }))
  })
})
