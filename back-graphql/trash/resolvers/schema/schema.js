'use strict'

import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from '../resolvers/resolvers'

const typeDefs = `
type Query {
    Users: [User!]!
    Ambientes: [Ambiente!]!
    Plantas: [Planta!]!
    Logs: [Log!]!
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
    logs: [Log!]
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
    logs: [Log!]
}

type Log {
    _id: ID!
    nombre: String!
    tipo: Int!
    fecha: String!
    comentario: String!
    recurrencia: Bool
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
    ambiente: Ambiente!
    raza: String
    banco: String
    tipo: Int
    fotoperiodo: Int
    ratio: String
    floracion: Int
    comentario: String
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
}
`

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})