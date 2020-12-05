'use strict'

const path = require('path')
const util = require('util')

const fp = require('fastify-plugin')
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
    defaultContext: { config: uiOptions },
    root
  })

  fastify.get(uiOptions.basename || '/', (_, reply) => reply.view('index.ejs'))

  fastify.register(require('fastify-static'), {
    root,
    prefix: uiOptions.basename
  })

  // todo: how to do this only for the basename instead of the whole app?
  fastify.setNotFoundHandler((_, reply) => reply.view('index.ejs'))
}

module.exports = fp(ui)
