const Query = `
  type Query {
    accounts: [Account!]!
    hubs: [Hub!]!
    notes: [Note!]!
  }
`

module.exports = Query
