'use strict'

const Fastify = require('fastify')
const tap = require('tap')
const proxyquire = require('proxyquire')

const plugin = proxyquire('./plugin', {
  './plugins/ui': async () => {},
  './plugins/auth': async () => {},
  './plugins/graphql': async () => {}
})

const test = tap.test

test('no options', async t => {
  const fastify = Fastify()

  t.rejects(fastify.register(plugin))
})

test('config from env', async t => {
  let processEnv

  t.beforeEach(async () => {
    processEnv = { ...process.env }
  })

  t.afterEach(async () => {
    process.env = processEnv
  })

  t.test('provider', async t => {
    t.test('cognito', async t => {
      process.env.BROKENECK_PROVIDER = 'cognito'
      process.env.BROKENECK_COGNITO_REGION = 'region'
      process.env.BROKENECK_COGNITO_USER_POOL_ID = 'user pool id'

      t.resolves(Fastify().register(plugin))
    })

    t.test('auth0', async t => {
      process.env.BROKENECK_PROVIDER = 'auth0'
      process.env.BROKENECK_AUTH0_DOMAIN = 'domain'
      process.env.BROKENECK_AUTH0_CLIENT_ID = 'client id'
      process.env.BROKENECK_AUTH0_CLIENT_SECRET = 'client secret'
      process.env.BROKENECK_AUTH0_CONNECTION = 'connection'

      t.resolves(Fastify().register(plugin))
    })

    t.test('azure', async t => {
      process.env.BROKENECK_PROVIDER = 'azure'
      process.env.BROKENECK_AZURE_TENANT_ID = 'tenant id'
      process.env.BROKENECK_AZURE_CLIENT_ID = 'client id'
      process.env.BROKENECK_AZURE_SECRET = 'secret'

      t.resolves(Fastify().register(plugin))
    })
  })

  t.test('ui', async t => {
    // to satisfy other required options
    process.env.BROKENECK_PROVIDER = 'cognito'
    process.env.BROKENECK_COGNITO_REGION = 'region'
    process.env.BROKENECK_COGNITO_USER_POOL_ID = 'user pool id'

    process.env.BROKENECK_UI = true

    t.resolves(Fastify().register(plugin))
  })
})
