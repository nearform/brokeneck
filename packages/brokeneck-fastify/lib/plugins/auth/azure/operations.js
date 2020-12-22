'use strict'

const { Serializer } = require('@azure/ms-rest-js')
const { GraphRbacManagementMappers: Mappers } = require('@azure/graph')

const Parameters = require('./parameters')

const serializer = new Serializer(Mappers)

const listUsersOperationSpec = {
  httpMethod: 'GET',
  path: '{tenantID}/users',
  urlParameters: [Parameters.tenantID],
  queryParameters: [
    Parameters.filter,
    Parameters.top,
    Parameters.apiVersion,
    Parameters.search
  ],
  headerParameters: [Parameters.acceptLanguage],
  responses: {
    200: {
      bodyMapper: Mappers.UserListResult
    },
    default: {
      bodyMapper: Mappers.GraphError
    }
  },
  serializer
}
// 123456789abcdefg
const listUsersNextOperationSpec = {
  httpMethod: 'GET',
  path: '{tenantID}/{nextLink}',
  urlParameters: [Parameters.nextLink, Parameters.tenantID],
  queryParameters: [Parameters.apiVersion, Parameters.top, Parameters.search],
  headerParameters: [Parameters.acceptLanguage],
  responses: {
    200: {
      bodyMapper: Mappers.UserListResult
    },
    default: {
      bodyMapper: Mappers.GraphError
    }
  },
  serializer
}

const listGroupsOperationSpec = {
  httpMethod: 'GET',
  path: '{tenantID}/groups',
  urlParameters: [Parameters.tenantID],
  queryParameters: [
    Parameters.filter,
    Parameters.top,
    Parameters.apiVersion,
    Parameters.search
  ],
  headerParameters: [Parameters.acceptLanguage],
  responses: {
    200: {
      bodyMapper: Mappers.GroupListResult
    },
    default: {
      bodyMapper: Mappers.GraphError
    }
  },
  serializer
}

const listGroupsNextOperationSpec = {
  httpMethod: 'GET',
  path: '{tenantID}/{nextLink}',
  urlParameters: [Parameters.nextLink, Parameters.tenantID],
  queryParameters: [Parameters.apiVersion, Parameters.top],
  headerParameters: [Parameters.acceptLanguage],
  responses: {
    200: {
      bodyMapper: Mappers.GroupListResult
    },
    default: {
      bodyMapper: Mappers.GraphError
    }
  },
  serializer
}

const listGroupsUsersOperationSpec = {
  httpMethod: 'GET',
  path: '{tenantID}/groups/{groupId}/members',
  urlParameters: [Parameters.tenantID, Parameters.groupId],
  queryParameters: [
    Parameters.filter,
    Parameters.top,
    Parameters.apiVersion,
    Parameters.search
  ],
  headerParameters: [Parameters.acceptLanguage],
  responses: {
    200: {
      bodyMapper: Mappers.UserListResult
    },
    default: {
      bodyMapper: Mappers.GraphError
    }
  },
  serializer
}

const listGroupsUsersNextOperationSpec = {
  httpMethod: 'GET',
  path: '{tenantID}/{nextLink}',
  urlParameters: [Parameters.nextLink, Parameters.tenantID],
  queryParameters: [Parameters.apiVersion, Parameters.top],
  headerParameters: [Parameters.acceptLanguage],
  responses: {
    200: {
      bodyMapper: Mappers.UserListResult
    },
    default: {
      bodyMapper: Mappers.GraphError
    }
  },
  serializer
}

module.exports = {
  listUsersOperationSpec,
  listUsersNextOperationSpec,
  listGroupsOperationSpec,
  listGroupsNextOperationSpec,
  listGroupsUsersOperationSpec,
  listGroupsUsersNextOperationSpec
}
