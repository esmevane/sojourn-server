import uuid from 'uuid'
import find from 'lodash.find'
import filter from 'lodash.filter'
import * as Json from 'graphql-type-json'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

type Id = string
type Maybe<T> = T | void

type CreateAccount = (_: any, options: AccountOptions) => Accounts
type CreateHub = (_: any, options: HubOptions) => Hubs
type CreateNote = (_: any, options: NoteOptions) => Notes

interface HubOptions {
  name: string
}

interface NoteOptions {
  content: string
  ownerId: Id
}

interface MutationResolver {
  createAccount: CreateAccount
  createHub: CreateHub
  createNote: CreateNote
}

interface Identifiable {
  id: Id
}

interface AccountOptions {
  username: string
  hubId: Id
}

type AccountHub = (account: Accounts) => Maybe<Hubs>

interface AccountRelationships {
  hub: AccountHub
}

type HubAccounts = (hub: Hubs) => Accounts[]

interface HubRelationships {
  accounts: HubAccounts
}

type NoteOwner = (note: Notes) => Maybe<Accounts>

interface NoteRelationships {
  owner: NoteOwner
}

interface QueryResolver {
  accounts: () => Promise<Accounts[]>
  hubs: () => Promise<Hubs[]>
  notes: () => Promise<Notes[]>
}

class Accounts implements Identifiable {
  id: Id
  hubId: string
  username: string

  constructor(username: string, hub: Hubs) {
    this.id = uuid.v4()
    this.username = username
    this.hubId = hub.id
  }
}

class Hubs implements Identifiable {
  id: Id
  name: string

  constructor(name: string) {
    this.id = uuid.v4()
    this.name = name
  }
}

class Notes implements Identifiable {
  id: Id
  ownerId: string
  content: string

  constructor(content: string, owner: Accounts) {
    this.id = uuid.v4()
    this.ownerId = owner.id
    this.content = content
  }
}

const accounts: Accounts[] = []
const hubs: Hubs[] = []
const notes: Notes[] = []

const Query: QueryResolver = {
  accounts: async () => accounts,
  hubs: async () => hubs,
  notes: async () => notes,
}

const Topics: any = {
  Events: 'events',
  Accounts: { Base: 'events:accounts', Created: 'events:accounts:created' },
  Hubs: { Base: 'events:hubs', Created: 'events:hubs:created' },
  Notes: { Base: 'events:notes', Created: 'events:notes:created' },
}

const Subscription = {
  events: {
    subscribe: () => pubSub.asyncIterator(Topics.Events),
  },
}

const emitEvent = (content: any) => ({
  events: content,
})

const createdAccount = (account: Accounts) =>
  emitEvent({
    topic: Topics.Accounts.Created,
    payload: account,
  })

const createdHub = (hub: Hubs) =>
  emitEvent({
    topic: Topics.Hubs.Created,
    payload: hub,
  })

const createdNote = (note: Notes) =>
  emitEvent({
    topic: Topics.Notes.Created,
    payload: note,
  })

const createAccount: CreateAccount = (_, { username, hubId }) => {
  const hub: Maybe<Hubs> = find(hubs, hub => hub.id === hubId)
  const account: Accounts = new Accounts(username, hub || new Hubs('Unknown'))

  accounts.push(account)
  pubSub.publish(Topics.Events, createdAccount(account))

  return account
}

const createHub: CreateHub = (_, { name }) => {
  const hub: Hubs = new Hubs(name)

  hubs.push(hub)
  pubSub.publish(Topics.Events, createdHub(hub))

  return hub
}

const createNote: CreateNote = (_, { content, ownerId }) => {
  const owner: Maybe<Accounts> = find(
    accounts,
    account => account.id === ownerId
  )

  const note = new Notes(
    content,
    owner || createAccount(undefined, { username: 'Unknown', hubId: 'Unknown' })
  )

  notes.push(note)
  pubSub.publish(Topics.Events, createdNote(note))

  return note
}

const Mutation: MutationResolver = {
  createAccount,
  createHub,
  createNote,
}

const Hub: HubRelationships = {
  accounts: hub => filter(accounts, account => hub.id === account.hubId),
}

const Account: AccountRelationships = {
  hub: account => find(hubs, hub => hub.id === account.hubId),
}

const Note: NoteRelationships = {
  owner: note => find(accounts, account => account.id === note.ownerId),
}

const resolvers: any = {
  Account,
  Hub,
  Json,
  Note,
  Mutation,
  Query,
  Subscription,
}

export default resolvers
