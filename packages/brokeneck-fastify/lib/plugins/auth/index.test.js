'use strict'

const tap = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const Fastify = require('fastify')

tap.test('auth', async t => {
  const auth0 = sinon.stub().resolves()
  const azure = sinon.stub().resolves()
  const cognito = sinon.stub().resolves()

  const auth = proxyquire('./', {
    './auth0': auth0,
    './azure': azure,
    './cognito': cognito
  })

  t.tearDown(() => {
    sinon.restore()
  })

  t.test('auth0', async t => {
    await t.resolves(
      Fastify().register(auth, { provider: 'auth0', auth0: { some: 'config' } })
    )

    t.ok(auth0.calledOnceWith(sinon.match.any, { some: 'config' }))
  })

  t.test('azure', async t => {
    await t.resolves(
      Fastify().register(auth, { provider: 'azure', azure: { some: 'config' } })
    )

    t.ok(azure.calledOnceWith(sinon.match.any, { some: 'config' }))
  })

  t.test('cognito', async t => {
    await t.resolves(
      Fastify().register(auth, {
        provider: 'cognito',
        cognito: { some: 'config' }
      })
    )

    t.ok(cognito.calledOnceWith(sinon.match.any, { some: 'config' }))
  })
})
