const Mutation = `
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
`

module.exports = Mutation
