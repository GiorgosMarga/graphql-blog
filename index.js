require("dotenv").config();
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { prisma } = require("./db/prisma");
const cors = require("cors");
const authenticateMiddleware = require("./middlewares/authenticateMiddleware");
const app = express();
app.use(cors());

app.set("trust proxy", 1); // trust first proxy

app.use(authenticateMiddleware);
const start = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return req.user;
    },
  });
  await server.start();
  await prisma.$on();
  server.applyMiddleware({
    app,
  });
  app.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
};

start();
