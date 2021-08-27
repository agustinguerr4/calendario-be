'use strict'

import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'
const typeDefs = `
type Query {
    hello: String
    greet(name: String!): String
    Users: [User]
    Ambientes: [Ambiente]
    Plantas: [Planta]
}

type User {
    _id: ID
    firstName: String!
    lastName:  String!
    age:       Int
}

type Ambiente {
    _id: ID
    nombre: String!
    tipo:   Int!
    tiempo: Int!
}

type Planta {
    _id: ID
    nombre: String! 
    origen: Int!
    etapa: Int!
}

type Mutation {
    createUser(input: UserInput): User
    createAmbiente(input: AmbienteInput): Ambiente
    createPlanta(input: PlantaInput): Planta
    deleteUser(_id: ID): User
    updateUser(_id: ID, input: UserInput): User
    deleteAmbiente(_id: ID): Ambiente
    updateAmbiente(_id: ID, input: AmbienteInput): Ambiente
    deletePlanta(_id: ID): Planta
    updatePlanta(_id: ID, input: PlantaInput): Planta
}

input UserInput {
    firstName: String!
    lastName:  String!
    age:       Int!
}

input AmbienteInput {
    nombre: String!
    tipo:   Int!
    tiempo: Int!
}

input PlantaInput {
    nombre: String! 
    origen: Int!
    etapa: Int!
}
`

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})