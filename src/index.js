const createApp = require('express')
const { createServer } = require('http')

const cors = require('cors')
const bodyParser = require('body-parser')

const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { SubscriptionServer } = require('subscriptions-transport-ws')

const schema = require('./schema')
const createConfig = require('./config')

const app = createApp()
const socket = createServer(app)
const Config = createConfig(socket)

const graphql = graphqlExpress({ schema, debug: true })
const graphiql = graphiqlExpress({
  endpointURL: Config.Paths.api,
  subscriptionsEndpoint: Config.Uris.sockets
})

app.use('*', cors({ origin: '*' }))
app.use(Config.Paths.api, bodyParser.json(), graphql)
app.use(Config.Paths.debug, graphiql)

socket.listen(
  Config.Port,
  () => new SubscriptionServer(Config.Graph, Config.Server)
)
