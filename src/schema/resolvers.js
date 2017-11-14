const uuid = require('uuid')
const find = require('lodash.find')
const filter = require('lodash.filter')
const Json = require('graphql-type-json')
const { PubSub } = require('graphql-subscriptions')

const pubSub = new PubSub()

class Accounts {
  constructor(username, hub) {
    this.id = uuid.v4()
    this.username = username
    this.hubId = hub.id
  }
}

class Hubs {
  constructor(name) {
    this.id = uuid.v4()
    this.name = name
  }
}

class Notes {
  constructor(content, owner) {
    this.id = uuid.v4()
    this.ownerId = owner.id
    this.content = content
  }
}

const accounts = []
const hubs = []
const notes = []

const Query = {
  hubs: async () => hubs,
  accounts: async () => accounts,
  notes: async () => notes
}

const Topics = {
  Events: 'events',
  Accounts: { Base: 'events:accounts', Created: 'events:accounts:created' },
  Hubs: { Base: 'events:hubs', Created: 'events:hubs:created' },
  Notes: { Base: 'events:notes', Created: 'events:notes:created' }
}

const Subscription = {
  events: {
    subscribe: () => pubSub.asyncIterator(Topics.Events)
  }
}

const emitEvent = content => ({
  events: content
})

const createdAccount = account =>
  emitEvent({
    topic: Topics.Accounts.Created,
    payload: account
  })

const createdHub = hub =>
  emitEvent({
    topic: Topics.Hubs.Created,
    payload: hub
  })

const createdNote = note =>
  emitEvent({
    topic: Topics.Notes.Created,
    payload: note
  })

const Mutation = {
  createAccount: (_, { username, hubId }) => {
    const hub = find(hubs, hub => hub.id === hubId)
    const account = new Accounts(username, hub)

    accounts.push(account)
    pubSub.publish(Topics.Events, createdAccount(account))

    return account
  },

  createHub: (_, { name }) => {
    const hub = new Hubs(name)

    hubs.push(hub)
    pubSub.publish(Topics.Events, createdHub(hub))

    return hub
  },

  createNote: (_, { content, ownerId }) => {
    const owner = find(accounts, account => account.id === ownerId)
    const note = new Notes(content, owner)

    notes.push(note)
    pubSub.publish(Topics.Events, createdNote(note))

    return note
  }
}

const Hub = {
  accounts: hub => filter(accounts, account => hub.id === account.hubId)
}

const Account = {
  hub: account => find(hubs, hub => hub.id === account.hubId)
}

const Note = {
  owner: note => find(accounts, account => account.id === note.ownerId)
}

module.exports = {
  Account,
  Hub,
  Json,
  Note,
  Mutation,
  Query,
  Subscription
}
