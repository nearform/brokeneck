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

  t.test('returns the meta', async t => {
    t.same(provider.meta, {
      name: 'cognito',
      capabilities: {
        canSearchGroups: false
      }
    })
  })

  t.test('users', async t => {
    t.test('without page', async t => {
      const users = faker.random.arrayElements()
      awsCognito.listUsers = stubAws(p => p.resolves({ Users: users }))

      const result = await provider.listUsers({
        pageSize: 2,
        search: 'search'
      })

      t.same(result, { data: users, nextPage: undefined })
    })

    t.test('without search', async t => {
      const users = faker.random.arrayElements()
      awsCognito.listUsers = stubAws(p => p.resolves({ Users: users }))

      const result = await provider.listUsers({
        pageSize: 2
      })

      t.same(result, { data: users, nextPage: undefined })
    })

    t.test('returns users', async t => {
      const users = faker.random.arrayElements()
      awsCognito.listUsers = stubAws(p => p.resolves({ Users: users }))

      const result = await provider.listUsers({
        pageNumber: 1,
        pageSize: 2,
        search: 'search'
      })

      t.same(result, { data: users, nextPage: undefined })
    })
  })

  t.test('returns user', async t => {
    const id = faker.datatype.uuid()
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

      t.same(result, { data: groups, nextPage: undefined })
    })

    t.test('returns users', async t => {
      const groups = faker.random.arrayElements()
      awsCognito.listGroups = stubAws(p => p.resolves({ Groups: groups }))

      const result = await provider.listGroups({
        pageNumber: 1,
        pageSize: 2
      })

      t.same(result, { data: groups, nextPage: undefined })
    })
  })

  t.test('returns group', async t => {
    const id = faker.datatype.uuid()
    const group = { id }

    awsCognito.getGroup = stubAws(p => p.resolves({ Group: group }))

    const result = await provider.getGroup(id)

    t.equal(result, group)

    sinon.assert.calledWith(awsCognito.getGroup, sinon.match({ GroupName: id }))
  })

  t.test('creates user', async t => {
    const Username = faker.datatype.uuid()
    const user = { Username }

    awsCognito.adminCreateUser = stubAws(p => p.resolves({ User: user }))

    const result = await provider.createUser(user)

    t.equal(result, user)

    sinon.assert.calledWith(awsCognito.adminCreateUser, sinon.match(user))
  })

  t.test('user update', async t => {
    t.test('enables user', async () => {
      const id = faker.datatype.uuid()
      const input = { Enabled: true }

      awsCognito.adminEnableUser = stubAws(p => p.resolves())

      await provider.editUser(id, input)

      sinon.assert.calledWith(
        awsCognito.adminEnableUser,
        sinon.match({ Username: id })
      )
    })

    t.test('disables user', async () => {
      const id = faker.datatype.uuid()
      const input = { Enabled: false }

      awsCognito.adminDisableUser = stubAws(p => p.resolves())

      await provider.editUser(id, input)

      sinon.assert.calledWith(
        awsCognito.adminDisableUser,
        sinon.match({ Username: id })
      )
    })
  })

  t.test('creates group', async t => {
    const GroupName = faker.datatype.uuid()
    const group = { GroupName }

    awsCognito.createGroup = stubAws(p => p.resolves({ Group: group }))

    const result = await provider.createGroup(group)

    t.equal(result, group)

    sinon.assert.calledWith(awsCognito.createGroup, sinon.match(group))
  })

  t.test('edits group', async () => {
    const id = faker.datatype.uuid()
    const input = { property: faker.random.word() }

    awsCognito.updateGroup = stubAws(p => p.resolves())

    await provider.editGroup(id, input)

    sinon.assert.calledWith(
      awsCognito.updateGroup,
      sinon.match({ GroupName: id, ...input })
    )
  })

  t.test('lists groups for user', async t => {
    const Username = faker.datatype.uuid()
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
    const GroupName = faker.datatype.uuid()
    const group = { GroupName }
    const users = faker.random.arrayElements()

    awsCognito.listUsersInGroup = stubAws(p => p.resolves({ Users: users }))

    const result = await provider.listUsersForGroup({ group })

    t.same(result, { data: users, nextPage: undefined })

    sinon.assert.calledWith(awsCognito.listUsersInGroup, sinon.match(group))
  })

  t.test('add user to group', async t => {
    const userId = faker.datatype.uuid()
    const groupId = faker.datatype.uuid()

    awsCognito.adminAddUserToGroup = stubAws(p => p.resolves())

    await provider.addUserToGroup({ userId, groupId })

    sinon.assert.calledWith(
      awsCognito.adminAddUserToGroup,
      sinon.match({ Username: userId, GroupName: groupId })
    )
  })

  t.test('remove user from group', async t => {
    const userId = faker.datatype.uuid()
    const groupId = faker.datatype.uuid()

    awsCognito.adminRemoveUserFromGroup = stubAws(p => p.resolves())

    await provider.removeUserFromGroup({ userId, groupId })

    sinon.assert.calledWith(
      awsCognito.adminRemoveUserFromGroup,
      sinon.match({ Username: userId, GroupName: groupId })
    )
  })

  t.test('delete user', async t => {
    const id = faker.datatype.uuid()

    awsCognito.adminDeleteUser = stubAws(p => p.resolves())

    await provider.deleteUser({ id })

    sinon.assert.calledWith(
      awsCognito.adminDeleteUser,
      sinon.match({ Username: id })
    )
  })

  t.test('delete group', async t => {
    const id = faker.datatype.uuid()

    awsCognito.deleteGroup = stubAws(p => p.resolves())

    await provider.deleteGroup({ id })

    sinon.assert.calledWith(
      awsCognito.deleteGroup,
      sinon.match({ GroupName: id })
    )
  })
})
