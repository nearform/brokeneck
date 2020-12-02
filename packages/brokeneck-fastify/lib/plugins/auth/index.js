'use strict'

const fp = require('fastify-plugin')

const authProviders = {
  auth0: require('./auth0'),
  cognito: require('./cognito'),
  azure: require('./azure')
}

function auth(server, options) {
  return server.register(
    authProviders[options.provider],
    options[options.provider]
  )
}

module.exports = fp(auth)
