'use strict'

const acceptLanguage = {
  parameterPath: 'acceptLanguage',
  mapper: {
    serializedName: 'accept-language',
    defaultValue: 'en-US',
    type: {
      name: 'String'
    }
  }
}
const apiVersion = {
  parameterPath: 'apiVersion',
  mapper: {
    required: true,
    serializedName: 'api-version',
    type: {
      name: 'String'
    }
  }
}
const filter = {
  parameterPath: ['options', 'filter'],
  mapper: {
    serializedName: '$filter',
    type: {
      name: 'String'
    }
  }
}

const top = {
  parameterPath: ['options', 'top'],
  mapper: {
    serializedName: '$top',
    type: {
      name: 'Number'
    }
  }
}

const search = {
  parameterPath: ['options', 'search'],
  mapper: {
    serializedName: '$search',
    type: {
      name: 'String'
    }
  }
}

const nextLink = {
  parameterPath: 'nextLink',
  mapper: {
    required: true,
    serializedName: 'nextLink',
    type: {
      name: 'String'
    }
  },
  skipEncoding: true
}
const tenantID = {
  parameterPath: 'tenantID',
  mapper: {
    required: true,
    serializedName: 'tenantID',
    type: {
      name: 'String'
    }
  }
}

module.exports = {
  tenantID,
  acceptLanguage,
  filter,
  apiVersion,
  top,
  search,
  nextLink
}
