'use strict'

import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const typeDefs = `
type Query {
    Users: [User!]!
    Ambientes: [Ambiente!]!
    Plantas: [Planta!]!
    LogsA: [LogA!]!
    LogsP: [LogP!]!
    login(email: String!, password: String!): AuthData!
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type User {
    _id: ID!
    firstName: String
    lastName:  String
    age:       Int
    email: String
    password: String
    ambientes: [Ambiente!]
}

type Ambiente {
    _id: ID!
    nombre: String!
    tipo:   Int!
    tiempo: Int!
    user: User!
    plantas: [Planta!]
    logs: [LogA!]
}

type Planta {
    _id: ID!
    nombre: String!
    origen: Int!
    etapa: Int!
    ambiente: Ambiente!
    raza: String
    banco: String
    tipo: Int
    fotoperiodo: Int
    ratio: String
    floracion: Int
    comentario: String
    logs: [LogP!]
}

type LogA {
    _id: ID!
    nombre: String!
    tipo: Int!
    fecha: String!
    comentario: String!
    recurrencia: Boolean
    id_parent: Ambiente!
}

type LogP {
    _id: ID!
    nombre: String!
    tipo: Int!
    fecha: String!
    comentario: String!
    recurrencia: Boolean
    id_parent: Planta!
}

input UserInput {
    firstName: String!
    lastName:  String!
    age:       Int!
    email: String!
    password: String!
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
    raza: String
    banco: String
    tipo: Int
    fotoperiodo: Int
    ratio: String
    floracion: Int
    comentario: String
}

input LogInput {
    nombre: String!
    tipo: Int!
    id_parent: String
    fecha: String
    comentario: String
    recurrencia: Boolean

}


type Mutation {
    createUser(input: UserInput): User
    deleteUser(_id: ID): User
    updateUser(_id: ID, input: UserInput): User

    createAmbiente(input: AmbienteInput): Ambiente
    deleteAmbiente(_id: ID): Ambiente
    updateAmbiente(_id: ID, input: AmbienteInput): Ambiente

    createPlanta(input: PlantaInput): Planta
    deletePlanta(_id: ID): Planta
    updatePlanta(_id: ID, input: PlantaInput): Planta

    createLogA(input: LogInput): LogA
    deleteLogA(_id: ID): LogA
    updateLogA(_id: ID, input: LogInput): LogA


    createLogP(input: LogInput): LogP
    deleteLogP(_id: ID): LogP
    updateLogP(_id: ID, input: LogInput): LogP
}
`

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})