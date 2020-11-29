'use strict'

function envConfig() {
  return {
    ui: process.env.BROKENECK_UI,
    provider: process.env.BROKENECK_PROVIDER,
    auth0: {
      domain: process.env.BROKENECK_AUTH0_DOMAIN,
      clientId: process.env.BROKENECK_AUTH0_CLIENT_ID,
      clientSecret: process.env.BROKENECK_AUTH0_CLIENT_SECRET,
      connection: process.env.BROKENECK_AUTH0_CONNECTION
    },
    azure: {
      tenantId: process.env.BROKENECK_AZURE_TENANT_ID,
      clientId: process.env.BROKENECK_AZURE_CLIENT_ID,
      secret: process.env.BROKENECK_AZURE_SECRET
    },
    cognito: {
      region: process.env.BROKENECK_COGNITO_REGION,
      userPoolId: process.env.BROKENECK_COGNITO_USER_POOL_ID
    },
    mercurius: {
      graphiql: process.env.BROKENECK_MERCURIUS_GRAPHIQL
    }
  }
}

module.exports = envConfig
