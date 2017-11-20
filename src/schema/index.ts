import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolvers'

import Domains from './domains'
import Mutation from './mutation'
import Query from './query'
import Subscription from './subscription'

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

export default makeExecutableSchema({ typeDefs: types, resolvers })