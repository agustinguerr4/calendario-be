'use strict'

import express from 'express'
import { graphqlHTTP } from "express-graphql";
import { schema } from './graphql/schema'
import { connect } from './database'
import 'dotenv/config'
import cors from 'cors'
const app = express();
connect();

app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'Hello Word'
    })
})


app.use('/graphql', graphqlHTTP((req, res, graphQLParams) => {
    return {
        graphiql: true,
        schema,
        context: req
    }
}));

app.listen(process.env.PORT, () => { console.log(`Servidor iniciado en el puerto ${process.env.PORT}`) });