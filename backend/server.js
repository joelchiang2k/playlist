const { createServer } = require('node:http');
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const songRoute = require('./routes/songRoute');
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

require('dotenv').config();

const username = encodeURIComponent(process.env.REACT_APP_MONGO_USERNAME);
const password = encodeURIComponent(process.env.REACT_APP_MONGO_PASSWORD);

const app = express();
app.use(bodyParser.json());
//changes

const uri = `mongodb+srv://${username}:${password}@serverlessinstance0.21ikl5q.mongodb.net/?retryWrites=true&w=majority&appName=ServerlessInstance0`;

//ApolloServer
//typeDefs: GraphQL Type Definitions
//resolvers: How do we resolve queries / mutations

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose.connect(uri, { useNewUrlParser: true} )
    .then(() => {
        console.log("MongoDB Connection Successful");
        return server.listen({port: process.env.REACT_APP_PORT})
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    })

