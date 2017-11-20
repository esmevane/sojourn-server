import * as createApp from "express";
import { createServer } from "http";

import * as cors from "cors";
import * as bodyParser from "body-parser";

import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";

import schema from "./schema";
import createConfig from "./config";

const app = createApp();
const runApp = (request: any, response: any) => app(request, response);
const socket = createServer(runApp);
const Config = createConfig(socket);

const graphql = graphqlExpress({ schema, debug: true });
const graphiql = graphiqlExpress({
  endpointURL: Config.Paths.api,
  subscriptionsEndpoint: Config.Uris.sockets
});

app.use("*", cors({ origin: "*" }));
app.use(Config.Paths.api, bodyParser.json(), graphql);
app.use(Config.Paths.debug, graphiql);

socket.listen(
  Config.Port,
  () => new SubscriptionServer(Config.Graph, Config.Server)
);
