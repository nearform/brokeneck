'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Fastify = require('fastify')

tap.test('auth0', async t => {
  const provider = sinon.stub()

  const auth0 = proxyquire('./', {
    './provider': function () {
      return provider
    }
  })

  t.tearDown(() => {
    sinon.restore()
  })

  t.test('registers the plugin', async t => {
    const fastify = Fastify()
    fastify.graphql = {
      extendSchema: sinon.stub()
    }

    await t.resolves(fastify.register(auth0))

    sinon.assert.calledOnce(fastify.graphql.extendSchema)
    t.equal(fastify.provider, provider)
  })
})
