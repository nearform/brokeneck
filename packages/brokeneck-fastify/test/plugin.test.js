'use strict'

const Fastify = require('fastify')
const tap = require('tap')
const proxyquire = require('proxyquire')

const plugin = proxyquire('../', {
  './plugins/ui': async () => {},
  './plugins/auth': async () => {},
  './plugins/graphql': async () => {}
})

const test = tap.test

test('no options', async t => {
  t.plan(1)

  const fastify = Fastify()

  t.rejects(fastify.register(plugin))
})

test('config from env', async t => {
  t.plan(2)

  let processEnv

  t.beforeEach(async () => {
    processEnv = { ...process.env }
  })

  t.tearDown(() => {
    process.env = processEnv
  })

  t.test('provider', t => {
    t.plan(3)

    t.test('cognito', t => {
      t.plan(1)
      process.env.BROKENECK_PROVIDER = 'cognito'
      process.env.BROKENECK_COGNITO_REGION = 'region'
      process.env.BROKENECK_COGNITO_USER_POOL_ID = 'user pool id'

      t.resolves(Fastify().register(plugin))
    })

    t.test('auth0', t => {
      t.plan(1)
      process.env.BROKENECK_PROVIDER = 'auth0'
      process.env.BROKENECK_AUTH0_DOMAIN = 'domain'
      process.env.BROKENECK_AUTH0_CLIENT_ID = 'client id'
      process.env.BROKENECK_AUTH0_CLIENT_SECRET = 'client secret'
      process.env.BROKENECK_AUTH0_CONNECTION = 'connection'

      t.resolves(Fastify().register(plugin))
    })

    t.test('azure', t => {
      t.plan(1)

      process.env.BROKENECK_PROVIDER = 'azure'
      process.env.BROKENECK_AZURE_TENANT_ID = 'tenant id'
      process.env.BROKENECK_AZURE_CLIENT_ID = 'client id'
      process.env.BROKENECK_AZURE_SECRET = 'secret'

      t.resolves(Fastify().register(plugin))
    })
  })

  t.test('ui', t => {
    t.plan(1)

    process.env.BROKENECK_UI = true

    t.resolves(Fastify().register(plugin))
  })
})
