'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Fastify = require('fastify')

tap.test('cognito', async t => {
  const provider = sinon.stub()

  const cognito = proxyquire('./', {
    './provider': function () {
      return provider
    }
  })

  t.afterEach(async () => {
    sinon.restore()
  })

  t.test('registers the plugin', async t => {
    const fastify = Fastify()
    fastify.graphql = {
      extendSchema: sinon.stub()
    }

    await t.resolves(fastify.register(cognito))

    sinon.assert.calledOnce(fastify.graphql.extendSchema)
    t.equal(fastify.provider, provider)
  })
})
