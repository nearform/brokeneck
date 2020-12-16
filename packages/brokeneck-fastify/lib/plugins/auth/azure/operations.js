'use strict'

const { Serializer } = require('@azure/ms-rest-js')
const { GraphRbacManagementMappers: Mappers } = require('@azure/graph')

const Parameters = require('./parameters')

const serializer = new Serializer(Mappers)

const listOperationSpec = {
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

const listNextOperationSpec = {
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

module.exports = {
  listOperationSpec,
  listNextOperationSpec
}
