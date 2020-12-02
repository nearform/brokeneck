'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Fastify = require('fastify')

tap.test('cognito', async t => {
  const awsCognito = sinon.stub()

  const cognito = proxyquire('./cognito', {
    AWS: { CognitoIdentityServiceProvider: () => awsCognito }
  })

  t.tearDown(() => {
    sinon.restore()
  })

  t.test('registers the plugin', async t => {
    const fastify = Fastify()
    fastify.graphql = {
      extendSchema: sinon.stub()
    }

    await t.resolves(fastify.register(cognito))
    t.ok(fastify.graphql.extendSchema.calledOnce)
    t.ok(fastify.provider)
  })
})
