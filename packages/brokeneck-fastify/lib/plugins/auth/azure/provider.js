'use strict'

const { Client } = require('@microsoft/microsoft-graph-client')
const fetch = require('node-fetch')
const { GraphRbacManagementClient } = require('@azure/graph')

const {
  listGroupsOperationSpec,
  listGroupsNextOperationSpec,
  listGroupsUsersOperationSpec,
  listGroupsUsersNextOperationSpec
} = require('./operations')

function ClientCredentialsProvider(options) {
  let cachedToken

  function getStoredToken() {
    if (cachedToken && cachedToken.expiry > Date.now()) {
      return cachedToken.token
    }
  }

  function storeToken(token) {
    cachedToken = {
      token,
      expiry: Date.now() + token.expires_in * 1000
    }
  }

  return {
    async getAccessToken() {
      const storedToken = getStoredToken()

      if (storedToken) {
        return storedToken.access_token
      }

      const tokenRes = await fetch(
        `https://login.microsoftonline.com/${options.tenantId}/oauth2/v2.0/token`,
        {
          method: 'POST',
          body: new URLSearchParams({
            client_id: options.clientId,
            client_secret: options.secret,
            grant_type: 'client_credentials',
            scope: 'https://graph.microsoft.com/.default'
          })
        }
      )

      if (!tokenRes.ok) {
        throw new Error('could not get an access token')
      }

      const token = await tokenRes.json()

      storeToken(token)

      return token.access_token
    }
  }
}

function AzureProvider(options, credentials, logger) {
  const authProvider = new ClientCredentialsProvider(options)
  const azure = new GraphRbacManagementClient(credentials, options.tenantId)
  const client = Client.initWithMiddleware({ authProvider })

  return {
    name: 'azure',
    async listUsers({ pageNumber, pageSize, search }) {
      const api = client.api('/users').top(pageSize).count(true)

      if (search) api.search(`"displayName:${search}"`)
      if (pageNumber) api.skipToken(pageNumber)

      const result = await api.get()

      const searchParams =
        result['@odata.nextLink'] &&
        new URL(result['@odata.nextLink']).searchParams

      const users = {
        data: result.value,
        nextPage: searchParams
          ? searchParams.get('$skiptoken') || searchParams.get('$skipToken')
          : null
      }

      logger.debug({ users }, 'loaded users')

      return users
    },
    async getUser(id) {
      const user = await azure.users.get(id)

      logger.debug({ user }, 'loaded user')

      return user
    },
    async listGroups({ pageNumber, pageSize }) {
      const options = { top: pageSize }

      const result = await (pageNumber
        ? azure.sendOperationRequest(
            {
              nextLink: pageNumber,
              options
            },
            listGroupsNextOperationSpec
          )
        : azure.sendOperationRequest({ options }, listGroupsOperationSpec))

      const groups = { data: result, nextPage: result.odatanextLink }

      logger.debug({ groups }, 'loaded groups')

      return groups
    },
    async getGroup(id) {
      const group = await azure.groups.get(id)

      logger.debug({ group }, 'loaded group')

      return group
    },
    createUser({ password, forceChangePasswordNextLogin, ...input }) {
      return azure.users.create({
        ...input,
        accountEnabled: !!input.accountEnabled,
        passwordProfile: {
          password,
          forceChangePasswordNextLogin: !!forceChangePasswordNextLogin
        }
      })
    },
    createGroup(input) {
      return azure.groups.create(input)
    },
    async listGroupsForUser(user) {
      const userGroupsIds = await azure.users.getMemberGroups(user.objectId, {
        securityEnabledOnly: false
      })

      logger.debug({ userGroupsIds }, 'loaded groups for user')

      return Promise.all(
        userGroupsIds.map(groupId => azure.groups.get(groupId))
      )
    },
    async listUsersForGroup({ group, pageSize, pageNumber }) {
      const options = { top: pageSize }

      const result = await (pageNumber
        ? azure.sendOperationRequest(
            {
              nextLink: pageNumber,
              options
            },
            listGroupsUsersNextOperationSpec
          )
        : azure.sendOperationRequest(
            { groupId: group.objectId, options },
            listGroupsUsersOperationSpec
          ))

      const users = { data: result, nextPage: result.odatanextLink }

      logger.debug({ users }, "loaded group's users")

      return users
    },
    addUserToGroup({ userId, groupId }) {
      const userUrl = `https://graph.windows.net/${options.tenantId}/directoryObjects/${userId}`

      return azure.groups.addMember(groupId, {
        url: userUrl
      })
    },
    removeUserFromGroup({ userId, groupId }) {
      return azure.groups.removeMember(groupId, userId)
    },
    deleteUser({ id }) {
      return azure.users.deleteMethod(id)
    },
    deleteGroup({ id }) {
      return azure.groups.deleteMethod(id)
    }
  }
}

module.exports = AzureProvider
