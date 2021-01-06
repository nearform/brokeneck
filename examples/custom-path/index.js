'use strict'

const path = require('path')

const pkgDir = require('pkg-dir')
const brokeneck = require('@nearform/brokeneck-fastify')

async function customPath(fastify, options) {
  const envPath = path.join(
    pkgDir.sync(require.resolve('@nearform/brokeneck-fastify')),
    '.env'
  )

  require('dotenv').config({ path: envPath })

  fastify.register(brokeneck, { prefix: '/admin' })

  fastify.get('/', (req, reply) =>
    reply.header('Content-Type', 'text/html').send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Didact+Gothic&display=swap" rel="stylesheet">
    <style>
      body {
        padding: 1em;
        font-family: Roboto;
      }
    </style>
  </head>
  <body>
    <h1>it's alive!</h1>
    <p>You'll find the admin UI <a href='admin'>here</a></p>
  </body>
</html>`)
  )
}

module.exports = customPath
