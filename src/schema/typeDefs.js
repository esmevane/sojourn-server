const schema = `
  scalar Json

  type InternetAddress {
    id: ID!
    host: String!
    port: Int!
    protocol: String!
  }

  type Account {
    id: ID!
    username: String!
    hub: Hub!
    notes: [Note!]!
  }

  type Event {
    topic: String!
    payload: Json
  }

  type Hub {
    id: ID!
    name: String
    addresses: [InternetAddress!]!
    accounts: [Account!]!
    notes: [Note!]!
  }

  type Note {
    id: ID!
    owner: Account!
    content: String!
  }

  type Query {
    accounts: [Account!]!
    hubs: [Hub!]!
    notes: [Note!]!
  }

  type Mutation {
    createAccount (
      username: String!
      hubId: String!
    ): Account

    createNote (
      ownerId: String!
      content: String!
    ): Note

    createHub (
      name: String!
    ): Hub
  }

  type Subscription {
    events: Event
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

module.exports = schema
