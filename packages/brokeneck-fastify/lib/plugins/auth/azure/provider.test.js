'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const faker = require('faker')

tap.test('azure provider', async t => {
  const azure = {
    users: {},
    groups: {}
  }

  const AzureProvider = proxyquire('./provider', {
    '@azure/graph': {
      GraphRbacManagementClient: function () {
        return azure
      }
    }
  })

  const options = {
    tenantId: faker.random.uuid()
  }

  const provider = new AzureProvider(options, null, { debug: sinon.stub() })

  t.tearDown(() => {
    sinon.restore()
  })

  t.test('returns the name', async t => {
    t.equal(provider.name, 'azure')
  })

  t.test('returns users', async t => {
    const users = faker.random.arrayElements()
    azure.users.list = sinon.stub().resolves(users)

    const result = await provider.listUsers()

    t.equal(result, users)
  })

  t.test('returns user', async t => {
    const id = faker.random.uuid()
    const user = { id }

    azure.users.get = sinon.stub().resolves(user)

    const result = await provider.getUser(id)

    t.equal(result, user)

    sinon.assert.calledWith(azure.users.get, id)
  })

  t.test('returns groups', async t => {
    const groups = faker.random.arrayElements()
    azure.groups.list = sinon.stub().resolves(groups)

    const result = await provider.listGroups()

    t.equal(result, groups)
  })

  t.test('returns group', async t => {
    const id = faker.random.uuid()
    const group = { id }

    azure.groups.get = sinon.stub().resolves(group)

    const result = await provider.getGroup(id)

    t.equal(result, group)

    sinon.assert.calledWith(azure.groups.get, id)
  })

  t.test('creates user', async t => {
    const username = faker.random.uuid()
    const password = faker.internet.password()

    const user = { username, password }

    azure.users.create = sinon.stub().resolves(user)

    const result = await provider.createUser(user)

    t.equal(result, user)

    sinon.assert.calledWith(
      azure.users.create,
      sinon.match({
        username,
        accountEnabled: false,
        passwordProfile: {
          password,
          forceChangePasswordNextLogin: false
        }
      })
    )
  })

  t.test('creates group', async t => {
    const groupName = faker.random.uuid()
    const group = { groupName }

    azure.groups.create = sinon.stub().resolves(group)

    const result = await provider.createGroup(group)

    t.equal(result, group)

    sinon.assert.calledWith(azure.groups.create, sinon.match(group))
  })

  t.test('lists groups for user', async t => {
    const userId = faker.random.uuid()
    const user = { objectId: userId }
    const groupIds = faker.random.arrayElements()

    azure.users.getMemberGroups = sinon.stub().resolves(groupIds)
    azure.groups.get = sinon.stub().resolvesArg(0)

    const result = await provider.listGroupsForUser(user)

    t.deepEqual(result, groupIds)

    sinon.assert.calledWith(azure.users.getMemberGroups, user.objectId)

    groupIds.forEach(groupId => {
      sinon.assert.calledWith(azure.groups.get, groupId)
    })
  })

  t.test('lists users for group', async t => {
    const groupId = faker.random.uuid()
    const group = { objectId: groupId }
    const users = faker.random.arrayElements()

    azure.groups.getGroupMembers = sinon.stub().resolves(users)

    const result = await provider.listUsersForGroup(group)

    t.equal(result, users)

    sinon.assert.calledWith(azure.groups.getGroupMembers, group.objectId)
  })

  t.test('add user to group', async t => {
    const userId = faker.random.uuid()
    const groupId = faker.random.uuid()

    azure.groups.addMember = sinon.stub().resolves()

    await provider.addUserToGroup({ userId, groupId })

    sinon.assert.calledWith(azure.groups.addMember, groupId, {
      url: `https://graph.windows.net/${options.tenantId}/directoryObjects/${userId}`
    })
  })

  t.test('remove user from group', async t => {
    const userId = faker.random.uuid()
    const groupId = faker.random.uuid()

    azure.groups.removeMember = sinon.stub().resolves()

    await provider.removeUserFromGroup({ userId, groupId })

    sinon.assert.calledWith(azure.groups.removeMember, groupId, userId)
  })

  t.test('delete user', async t => {
    const id = faker.random.uuid()

    azure.users.deleteMethod = sinon.stub().resolves()

    await provider.deleteUser({ id })

    sinon.assert.calledWith(azure.users.deleteMethod, id)
  })

  t.test('delete group', async t => {
    const id = faker.random.uuid()

    azure.groups.deleteMethod = sinon.stub().resolves()

    await provider.deleteGroup({ id })

    sinon.assert.calledWith(azure.groups.deleteMethod, id)
  })
})
