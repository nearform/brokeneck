'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Fastify = require('fastify')

tap.test('graphql', async t => {
  const mercurius = sinon.stub().resolves()

  const graphql = proxyquire('./', {
    mercurius
  })

  t.tearDown(() => {
    sinon.restore()
  })

  t.test('registers the plugin', async t => {
    const fastify = Fastify()

    await t.resolves(fastify.register(graphql))

    sinon.assert.called(mercurius)
  })
})
