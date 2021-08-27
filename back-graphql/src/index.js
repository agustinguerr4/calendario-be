'use strict'

import express from 'express'
import { graphqlHTTP } from "express-graphql";
import { schema } from './schema'
import { connect } from './database'

import cors  from 'cors'
const app = express();
connect();

app.use( cors() );

app.get('/', (req, res) => {
    res.json({
        message: 'Hello Word'
    })
})

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}));

app.listen(3000, () => { console.log("Servidor iniciado en el puerto 3000") });