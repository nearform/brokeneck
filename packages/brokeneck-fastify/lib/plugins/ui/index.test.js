'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Fastify = require('fastify')

tap.test('ui', async t => {
  const ui = proxyquire('./', {})

  t.tearDown(() => {
    sinon.restore()
  })

  t.test('registers the plugin', async t => {
    const fastify = Fastify()

    await t.resolves(fastify.register(ui))
  })

  t.test('handles not found', async t => {
    const fastify = Fastify()

    await t.resolves(fastify.register(ui))

    const response = await fastify.inject('/404')

    t.equal(response.statusCode, 200)
  })

  t.test('handles /', async t => {
    const fastify = Fastify()

    await t.resolves(fastify.register(ui))

    const response = await fastify.inject('/')

    t.equal(response.statusCode, 200)
  })
})
