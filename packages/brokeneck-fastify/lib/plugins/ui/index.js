'use strict'

const path = require('path')
const util = require('util')

const pkgDir = require('pkg-dir')

const pluginConfig = require('../../pluginConfig')

async function ui(fastify, options) {
  const logger = fastify.log.child({ module: 'uiPlugin' })

  const uiOptions = pluginConfig(options.ui, pluginConfig.uiSchema)

  logger.debug(`ui options: ${util.inspect(uiOptions)}`)

  const root = path.join(
    pkgDir.sync(require.resolve('@nearform/brokeneck-html')),
    'build'
  )

  logger.debug(`serving ui from ${root}`)

  fastify.register(require('point-of-view'), {
    engine: {
      ejs: require('ejs')
    },
    defaultContext: {
      config: {
        basename: fastify.prefix || uiOptions.basename,
        serverUrl: `${fastify.prefix}${uiOptions.serverUrl}`
      }
    },
    root
  })

  fastify.get(uiOptions.basename || '/', (_, reply) => reply.view('index.ejs'))

  fastify.register(require('fastify-static'), {
    root,
    prefix: uiOptions.basename
  })

  fastify.setNotFoundHandler((_, reply) => reply.view('index.ejs'))
}

module.exports = ui
