import { execute, subscribe } from 'graphql'
import schema from './schema'

const createConfig = (server: any) => {
  const Port = 3001
  const Host = 'localhost'

  const Paths = {
    api: '/graphql',
    debug: '/graphiql',
    sockets: '/subscriptions',
  }

  const Uris = {
    sockets: `ws://${Host}:${Port}${Paths.sockets}`,
  }

  return {
    Port,
    Host,
    Paths,
    Uris,
    Graph: { execute, subscribe, schema },
    Server: { server, path: '/subscriptions' },
  }
}

export default createConfig
