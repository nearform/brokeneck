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

  t.afterEach(async () => {
    sinon.restore()
  })

  t.test('returns the meta', async t => {
    t.deepEqual(provider.meta, {
      name: 'azure',
      capabilities: {
        canSearchGroups: false
      }
    })
  })

  t.test('users', async t => {
    t.test('without page', async t => {
      const users = faker.random.arrayElements()
      azure.sendOperationRequest = sinon.stub().resolves(users)

      const result = await provider.listUsers({
        pageSize: 2,
        search: 'search'
      })

      t.deepEqual(result, { data: users, nextPage: undefined })
    })

    t.test('returns users', async t => {
      const users = faker.random.arrayElements()
      azure.sendOperationRequest = sinon.stub().resolves(users)

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

    azure.users.get = sinon.stub().resolves(user)

    const result = await provider.getUser(id)

    t.equal(result, user)

    sinon.assert.calledWith(azure.users.get, id)
  })

  t.test('groups', async t => {
    t.test('without page', async t => {
      const groups = faker.random.arrayElements()
      azure.sendOperationRequest = sinon.stub().resolves(groups)

      const result = await provider.listGroups({
        pageSize: 2
      })

      t.deepEqual(result, { data: groups, nextPage: undefined })
    })

    t.test('returns groups', async t => {
      const groups = faker.random.arrayElements()
      azure.sendOperationRequest = sinon.stub().resolves(groups)

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

  t.test('updates user', async t => {
    const id = faker.random.uuid()
    const property = faker.random.word()

    const input = { property }

    azure.users.update = sinon.stub().resolves()

    await provider.editUser(id, input)

    sinon.assert.calledWith(azure.users.update, id, input)
  })

  t.test('creates group', async t => {
    const groupName = faker.random.uuid()
    const group = { groupName }

    azure.groups.create = sinon.stub().resolves(group)

    const result = await provider.createGroup(group)

    t.equal(result, group)

    sinon.assert.calledWith(azure.groups.create, sinon.match(group))
  })

  t.test('updates group', async t => {
    const id = faker.random.uuid()
    const property = faker.random.word()

    const input = { property }

    azure.groups.update = sinon.stub().resolves()

    await provider.editGroup(id, input)

    sinon.assert.calledWith(azure.groups.update, id, input)
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

    azure.sendOperationRequest = sinon.stub().resolves(users)

    const result = await provider.listUsersForGroup({ group })

    t.deepEqual(result, { data: users, nextPage: undefined })

    sinon.assert.calledWith(azure.sendOperationRequest, {
      groupId: group.objectId,
      options: { top: undefined }
    })
  })

  t.test('lists users for group pagination', async t => {
    const groupId = faker.random.uuid()
    const group = { objectId: groupId }
    const users = faker.random.arrayElements()

    azure.sendOperationRequest = sinon.stub().resolves(users)

    const result = await provider.listUsersForGroup({
      group,
      pageNumber: '2',
      pageSize: 2
    })

    t.deepEqual(result, { data: users, nextPage: undefined })

    sinon.assert.calledWith(azure.sendOperationRequest, {
      nextLink: '2',
      options: { top: 2 }
    })
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
