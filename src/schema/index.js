const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

const Domains = require('./domains')
const Mutation = require('./mutation')
const Query = require('./query')
const Subscription = require('./subscription')

const Schema = `
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

const types = [
  Schema,
  Query,
  Mutation,
  Subscription,
  Domains.Events,
  Domains.Hubs
]

module.exports = makeExecutableSchema({ typeDefs: types, resolvers })
