'use strict'

const envConfig = require('./envConfig')
const pluginConfig = require('./pluginConfig')

async function plugin(fastify, pluginOptions) {
  const options = pluginConfig({ ...envConfig(), ...pluginOptions })

  if (options.ui) {
    fastify.register(require('./plugins/ui'), options)
  }

  await fastify.register(require('./plugins/graphql'), options)
  await fastify.register(require('./plugins/auth'), options)
}

module.exports = plugin
