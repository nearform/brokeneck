'use strict'

const cors = require('fastify-cors')

const plugin = require('./lib/plugin')

module.exports = async function (fastify, options) {
  fastify.register(cors, {
    origin: !!process.env.CORS_ORIGIN,
    credentials: true
  })
  fastify.register(plugin)
}
