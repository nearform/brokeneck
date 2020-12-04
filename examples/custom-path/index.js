'use strict'

const path = require('path')

const pkgDir = require('pkg-dir')
const brokeneck = require('brokeneck-fastify')

async function customPath(fastify, options) {
  const envPath = path.join(
    pkgDir.sync(require.resolve('brokeneck-fastify')),
    '.env'
  )

  require('dotenv').config({ path: envPath })

  fastify.register(brokeneck, {
    ui: {
      // basename of where the UI is served from
      basename: '/admin',
      // url of the GraphQL server used by the UI
      serverUrl: '/admin/graphql'
    },
    mercurius: {
      // prefix of the GraphQL route in the mercurius configuration
      prefix: '/admin'
    }
  })
}

module.exports = customPath
