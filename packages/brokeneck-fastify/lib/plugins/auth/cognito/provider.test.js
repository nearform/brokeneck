'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const faker = require('faker')

function stubAws(p) {
  return sinon.stub().returns({ promise: p(sinon.stub()) })
}

tap.test('cognito provider', async t => {
  const awsCognito = {}

  const CognitoProvider = proxyquire('./provider', {
    'aws-sdk': {
      CognitoIdentityServiceProvider: function () {
        return awsCognito
      }
    }
  })

  const provider = new CognitoProvider({}, { debug: sinon.stub() })

  t.afterEach(async () => {
    sinon.restore()
  })

  t.test('returns the name', async t => {
    t.equal(provider.name, 'cognito')
  })

  t.test('users', async t => {
    t.test('without page', async t => {
      const users = faker.random.arrayElements()
      awsCognito.listUsers = stubAws(p => p.resolves({ Users: users }))

      const result = await provider.listUsers({
        pageSize: 2,
        search: 'search'
      })

      t.deepEqual(result, { data: users, nextPage: undefined })
    })

    t.test('without search', async t => {
      const users = faker.random.arrayElements()
      awsCognito.listUsers = stubAws(p => p.resolves({ Users: users }))

      const result = await provider.listUsers({
        pageSize: 2
      })

      t.deepEqual(result, { data: users, nextPage: undefined })
    })

    t.test('returns users', async t => {
      const users = faker.random.arrayElements()
      awsCognito.listUsers = stubAws(p => p.resolves({ Users: users }))

      const result = await provider.listUsers({
        pageNumber: 1,
        pageSize: 2,
        search: 'search'
      })

      t.deepEqual(result, { data: users, nextPage: undefined })
    })
  })

  t.test('returns user', async t => {
    const id = faker.random.uuid()
    const user = { id }

    awsCognito.adminGetUser = stubAws(p => p.resolves(user))

    const result = await provider.getUser(id)

    t.equal(result, user)

    sinon.assert.calledWith(
      awsCognito.adminGetUser,
      sinon.match({ Username: id })
    )
  })

  t.test('groups', async t => {
    t.test('without page', async t => {
      const groups = faker.random.arrayElements()
      awsCognito.listGroups = stubAws(p => p.resolves({ Groups: groups }))

      const result = await provider.listGroups({
        pageSize: 2
      })

      t.deepEqual(result, { data: groups, nextPage: undefined })
    })

    t.test('returns users', async t => {
      const groups = faker.random.arrayElements()
      awsCognito.listGroups = stubAws(p => p.resolves({ Groups: groups }))

      const result = await provider.listGroups({
        pageNumber: 1,
        pageSize: 2
      })

      t.deepEqual(result, { data: groups, nextPage: undefined })
    })
  })

  t.test('returns group', async t => {
    const id = faker.random.uuid()
    const group = { id }

    awsCognito.getGroup = stubAws(p => p.resolves({ Group: group }))

    const result = await provider.getGroup(id)

    t.equal(result, group)

    sinon.assert.calledWith(awsCognito.getGroup, sinon.match({ GroupName: id }))
  })

  t.test('creates user', async t => {
    const Username = faker.random.uuid()
    const user = { Username }

    awsCognito.adminCreateUser = stubAws(p => p.resolves({ User: user }))

    const result = await provider.createUser(user)

    t.equal(result, user)

    sinon.assert.calledWith(awsCognito.adminCreateUser, sinon.match(user))
  })

  t.test('creates group', async t => {
    const GroupName = faker.random.uuid()
    const group = { GroupName }

    awsCognito.createGroup = stubAws(p => p.resolves({ Group: group }))

    const result = await provider.createGroup(group)

    t.equal(result, group)

    sinon.assert.calledWith(awsCognito.createGroup, sinon.match(group))
  })

  t.test('lists groups for user', async t => {
    const Username = faker.random.uuid()
    const user = { Username }
    const groups = faker.random.arrayElements()

    awsCognito.adminListGroupsForUser = stubAws(p =>
      p.resolves({ Groups: groups })
    )

    const result = await provider.listGroupsForUser(user)

    t.equal(result, groups)

    sinon.assert.calledWith(
      awsCognito.adminListGroupsForUser,
      sinon.match(user)
    )
  })

  t.test('lists users for group', async t => {
    const GroupName = faker.random.uuid()
    const group = { GroupName }
    const users = faker.random.arrayElements()

    awsCognito.listUsersInGroup = stubAws(p => p.resolves({ Users: users }))

    const result = await provider.listUsersForGroup(group)

    t.equal(result, users)

    sinon.assert.calledWith(awsCognito.listUsersInGroup, sinon.match(group))
  })

  t.test('add user to group', async t => {
    const userId = faker.random.uuid()
    const groupId = faker.random.uuid()

    awsCognito.adminAddUserToGroup = stubAws(p => p.resolves())

    await provider.addUserToGroup({ userId, groupId })

    sinon.assert.calledWith(
      awsCognito.adminAddUserToGroup,
      sinon.match({ Username: userId, GroupName: groupId })
    )
  })

  t.test('remove user from group', async t => {
    const userId = faker.random.uuid()
    const groupId = faker.random.uuid()

    awsCognito.adminRemoveUserFromGroup = stubAws(p => p.resolves())

    await provider.removeUserFromGroup({ userId, groupId })

    sinon.assert.calledWith(
      awsCognito.adminRemoveUserFromGroup,
      sinon.match({ Username: userId, GroupName: groupId })
    )
  })

  t.test('delete user', async t => {
    const id = faker.random.uuid()

    awsCognito.adminDeleteUser = stubAws(p => p.resolves())

    await provider.deleteUser({ id })

    sinon.assert.calledWith(
      awsCognito.adminDeleteUser,
      sinon.match({ Username: id })
    )
  })

  t.test('delete group', async t => {
    const id = faker.random.uuid()

    awsCognito.deleteGroup = stubAws(p => p.resolves())

    await provider.deleteGroup({ id })

    sinon.assert.calledWith(
      awsCognito.deleteGroup,
      sinon.match({ GroupName: id })
    )
  })
})
