'use strict'

const fp = require('fastify-plugin')
const mercurius = require('mercurius')
const { makeExecutableSchema } = require('graphql-tools')

const typeDefs = require('./typeDefs')
const makeResolvers = require('./resolvers')
const makeLoaders = require('./loaders')

async function graphql(fastify, options) {
  const resolvers = makeResolvers(fastify)
  const loaders = makeLoaders(fastify)

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  fastify.register(mercurius, {
    schema,
    loaders,
    ...options.mercurius
  })
}

module.exports = fp(graphql)
