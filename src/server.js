import express from 'express';
import graphQLHTTP from 'express-graphql';
import renderOnServer from './renderOnServer'
import {schema} from './data/schema';

const APP_PORT = 8080;

// The server is just a simple Express app
var app = express();

// We respond to all GraphQL requests from `/graphql` using the
// `express-graphql` middleware, which we pass our schema to.
app.use('/graphql', graphQLHTTP({schema: schema, graphiql: true}));

// Serve HTML
app.get('/', (req, res, next) => {
    renderOnServer(res, next);
});

// Resources
app.use("/", express.static( __dirname + "/../public/"));


app.listen( APP_PORT, function() { 
	console.log('Listening on '+APP_PORT+'...');
});