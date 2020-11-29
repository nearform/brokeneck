'use strict'

const fp = require('fastify-plugin')

const authProviders = {
  auth0: require('./auth0'),
  cognito: require('./cognito'),
  azure: require('./azure')
}

async function auth(server, options) {
  server.register(authProviders[options.provider], options[options.provider])
}

module.exports = fp(auth)
