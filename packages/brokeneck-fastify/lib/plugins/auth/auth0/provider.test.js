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

  const alphabetArray = [...new Array(26)].map((_, i) =>
    String.fromCharCode(97 + i)
  )
  const makeArrayOfRandomElements = count =>
    faker.random.arrayElements(alphabetArray, count)

  t.afterEach(async () => {
    sinon.restore()
  })

  t.test('returns the meta', async t => {
    t.same(provider.meta, {
      name: 'auth0',
      capabilities: {
        canSearchGroups: true
      }
    })
  })

  t.test('users', async t => {
    t.test('no page', async t => {
      const users = makeArrayOfRandomElements(2)
      auth0.getUsers = sinon.stub().resolves({ users, start: 0, total: 10 })

      const result = await provider.listUsers({
        pageSize: 2,
        search: 'search'
      })

      t.same(result, { data: users, nextPage: 2 })
    })

    t.test('no search', async t => {
      const users = makeArrayOfRandomElements(2)
      auth0.getUsers = sinon.stub().resolves({ users, start: 0, total: 10 })

      const result = await provider.listUsers({
        pageSize: 2
      })

      t.same(result, { data: users, nextPage: 2 })
    })

    t.test('pagination', async t => {
      const users = makeArrayOfRandomElements(2)
      auth0.getUsers = sinon.stub().resolves({ users, start: 0, total: 2 })

      const result = await provider.listUsers({
        pageSize: 2
      })

      t.same(result, { data: users, nextPage: undefined })
    })

    t.test('page 1', async t => {
      const users = makeArrayOfRandomElements(2)
      auth0.getUsers = sinon.stub().resolves({ users, start: 0, total: 10 })

      const result = await provider.listUsers({
        pageNumber: 1,
        pageSize: 2,
        search: 'search'
      })

      t.same(result, { data: users, nextPage: 2 })
    })
  })

  t.test('returns user', async t => {
    const id = faker.datatype.uuid()
    const user = { id }

    auth0.getUser = sinon.stub().resolves(user)

    const result = await provider.getUser(id)

    t.equal(result, user)

    sinon.assert.calledWith(auth0.getUser, sinon.match({ id }))
  })

  t.test('groups', async t => {
    t.test('no page', async t => {
      const groups = makeArrayOfRandomElements(2)

      auth0.getRoles = sinon
        .stub()
        .resolves({ roles: groups, start: 0, total: 10 })

      const result = await provider.listGroups({
        pageSize: 2
      })

      t.same(result, { data: groups, nextPage: 2 })
    })

    t.test('no search', async t => {
      const groups = makeArrayOfRandomElements(2)
      auth0.getRoles = sinon
        .stub()
        .resolves({ roles: groups, start: 0, total: 2 })

      const result = await provider.listGroups({
        pageSize: 2
      })

      t.same(result, { data: groups, nextPage: undefined })
    })

    t.test('pagination', async t => {
      const groups = makeArrayOfRandomElements(2)
      auth0.getRoles = sinon.stub().resolves({
        roles: groups,
        start: 0,
        total: 2
      })

      const result = await provider.listGroups({
        pageSize: 2
      })

      t.same(result, { data: groups, nextPage: undefined })
    })

    t.test('page 1', async t => {
      const groups = makeArrayOfRandomElements(4)
      auth0.getRoles = sinon
        .stub()
        .resolves({ roles: groups, start: 0, total: 20 })

      const result = await provider.listGroups({
        pageNumber: 1,
        pageSize: 4
      })

      t.same(result, { data: groups, nextPage: 2 })
    })
  })

  t.test('returns group', async t => {
    const id = faker.datatype.uuid()
    const group = { id }

    auth0.getRole = sinon.stub().resolves(group)

    const result = await provider.getGroup(id)

    t.equal(result, group)

    sinon.assert.calledWith(auth0.getRole, sinon.match({ id }))
  })

  t.test('creates user', async t => {
    const username = faker.datatype.uuid()
    const user = { username }

    auth0.createUser = sinon.stub().resolves(user)

    const result = await provider.createUser(user)

    t.equal(result, user)

    sinon.assert.calledWith(auth0.createUser, sinon.match(user))
  })

  t.test('edits user', async t => {
    const id = faker.datatype.uuid()
    const input = { property: faker.random.word() }

    auth0.updateUser = sinon.stub().resolves()

    await provider.editUser(id, input)

    sinon.assert.calledWith(auth0.updateUser, { id }, input)
  })

  t.test('creates group', async t => {
    const groupName = faker.datatype.uuid()
    const group = { groupName }

    auth0.createRole = sinon.stub().resolves(group)

    const result = await provider.createGroup(group)

    t.equal(result, group)

    sinon.assert.calledWith(auth0.createRole, sinon.match(group))
  })

  t.test('edits group', async t => {
    const id = faker.datatype.uuid()
    const input = { property: faker.random.word() }

    auth0.updateRole = sinon.stub().resolves()

    await provider.editGroup(id, input)

    sinon.assert.calledWith(auth0.updateRole, { id }, input)
  })

  t.test('lists groups for user', async t => {
    const userId = faker.datatype.uuid()
    const user = { user_id: userId }
    const groups = faker.random.arrayElements()

    auth0.getUserRoles = sinon.stub().resolves(groups)

    const result = await provider.listGroupsForUser(user)

    t.equal(result, groups)

    sinon.assert.calledWith(auth0.getUserRoles, sinon.match({ id: userId }))
  })

  t.test('lists users for group', async t => {
    const groupId = faker.datatype.uuid()
    const group = { id: groupId }
    const users = makeArrayOfRandomElements(2)

    auth0.getUsersInRole = sinon.stub().resolves({ users, start: 0, total: 10 })

    const result = await provider.listUsersForGroup({
      group,
      pageSize: 2
    })

    t.same(result, { data: users, nextPage: 2 })

    sinon.assert.calledWith(auth0.getUsersInRole, sinon.match(group))
  })

  t.test('lists users for group pagination: more pages', async t => {
    const groupId = faker.datatype.uuid()
    const group = { id: groupId }
    const users = makeArrayOfRandomElements(2)

    auth0.getUsersInRole = sinon.stub().resolves({ users, start: 0, total: 10 })

    const result = await provider.listUsersForGroup({
      group,
      pageSize: 2,
      pageNumber: 1
    })

    t.same(result, { data: users, nextPage: 2 })

    sinon.assert.calledWith(auth0.getUsersInRole, sinon.match(group))
  })

  t.test('lists users for group pagination: no more pages', async t => {
    const groupId = faker.datatype.uuid()
    const group = { id: groupId }
    const users = makeArrayOfRandomElements(2)

    auth0.getUsersInRole = sinon.stub().resolves({ users, start: 0, total: 2 })

    const result = await provider.listUsersForGroup({
      group,
      pageSize: 2,
      pageNumber: 1
    })

    t.same(result, { data: users, nextPage: undefined })

    sinon.assert.calledWith(auth0.getUsersInRole, sinon.match(group))
  })

  t.test('add user to group', async t => {
    const userId = faker.datatype.uuid()
    const groupId = faker.datatype.uuid()

    auth0.assignRolestoUser = sinon.stub().resolves()

    await provider.addUserToGroup({ userId, groupId })

    sinon.assert.calledWith(
      auth0.assignRolestoUser,
      sinon.match({ id: userId }),
      sinon.match({ roles: [groupId] })
    )
  })

  t.test('remove user from group', async t => {
    const userId = faker.datatype.uuid()
    const groupId = faker.datatype.uuid()

    auth0.removeRolesFromUser = sinon.stub().resolves()

    await provider.removeUserFromGroup({ userId, groupId })

    sinon.assert.calledWith(
      auth0.removeRolesFromUser,
      sinon.match({ id: userId }),
      sinon.match({ roles: [groupId] })
    )
  })

  t.test('delete user', async t => {
    const id = faker.datatype.uuid()

    auth0.deleteUser = sinon.stub().resolves()

    await provider.deleteUser({ id })

    sinon.assert.calledWith(auth0.deleteUser, sinon.match({ id }))
  })

  t.test('delete group', async t => {
    const id = faker.datatype.uuid()

    auth0.deleteRole = sinon.stub().resolves()

    await provider.deleteGroup({ id })

    sinon.assert.calledWith(auth0.deleteRole, sinon.match({ id }))
  })
})
