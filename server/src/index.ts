import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";

(async () => {
    const app = express();

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        })
    });

    apolloServer.applyMiddleware({ app: app });

    app.listen(4000, () => console.log("http://localhost:4000/graphql"));
})();
