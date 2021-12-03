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

  t.afterEach(async () => {
    sinon.restore()
  })

  t.test('registers the plugin', async t => {
    const fastify = Fastify()

    await t.resolves(fastify.register(graphql))

    sinon.assert.called(mercurius)
  })
})

tap.test('graphql with mercurius', async t => {
  const graphql = require('./')

  t.test('registers the plugin', async t => {
    const fastify = Fastify()

    fastify.decorate('provider', {
      meta: {
        name: 'test'
      }
    })
    fastify.register(graphql)

    const query = `
      query {
        provider {
          name
        }
      }  
    `

    const response = await fastify.inject({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      url: '/graphql',
      body: JSON.stringify({ query })
    })

    t.same(response.json(), {
      data: {
        provider: {
          name: 'test'
        }
      }
    })
  })
})
