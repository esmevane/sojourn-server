import { ITypeDefinitions } from 'graphql-tools/dist/Interfaces'

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

const types: ITypeDefinitions = [
  Schema,
  Query,
  Mutation,
  Subscription,
  Domains.Events,
  Domains.Hubs,
]

export default types
