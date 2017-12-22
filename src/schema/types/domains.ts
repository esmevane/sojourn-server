const Json = `scalar Json`

const Event = `
  type Event {
    topic: String!
    payload: Json
  }
`

const InternetAddress = `
  type InternetAddress {
    id: ID!
    host: String!
    port: Int!
    protocol: String!
  }
`

const Account = `
  type Account {
    id: ID!
    username: String!
    hub: Hub!
    notes: [Note!]!
  }
`

const Hub = `
  type Hub {
    id: ID!
    name: String
    addresses: [InternetAddress!]!
    accounts: [Account!]!
    notes: [Note!]!
  }
`

const Note = `
  type Note {
    id: ID!
    owner: Account!
    content: String!
  }
`

const Domains = {
  Events: () => [Event, Json],
  Hubs: () => [Account, Hub, InternetAddress, Note],
}

export default Domains
