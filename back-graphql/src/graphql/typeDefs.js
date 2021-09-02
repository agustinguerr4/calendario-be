import { gql } from 'apollo-server'

module.exports = gql`
type Query {
    Users: [User]!

    Ambientes: [Ambiente]
    getMisAmbientes(id: String!): [Ambiente]!
    getAmbientePorId(id: String!): Ambiente

    Plantas: [Planta]
    LogsA: [LogA]!
    LogsP: [LogP]!

}


type User {
    _id: ID!
    username: String
    email: String
    password: String
    token: String
    ambientes: [Ambiente!]
    createdAt: String
}

type Ambiente {
    _id: ID!
    nombre: String
    tipo:   Int
    tiempo: Int
    user: User
    plantas: [Planta!]
    logs: [LogA!]
}

type Planta {
    _id: ID!
    nombre: String
    origen: Int
    etapa: Int
    ambiente: Ambiente
    user: User
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
    _id: ID
    nombre: String
    tipo: Int
    fecha: String
    comentario: String
    recurrencia: Boolean
    id_parent: Ambiente!
}

type LogP {
    _id: ID
    nombre: String
    tipo: Int
    fecha: String
    comentario: String
    recurrencia: Boolean
    id_parent: Planta!
}

input UserInputRegister {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
}

input UserInputLogin {
    username: String!
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
    ambiente: String
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
    createUser(input: UserInputRegister): User
    loginUser(input: UserInputLogin): User!
    deleteUser(_id: ID): User
    updateUser(_id: ID, input: UserInputRegister): User

    createAmbiente(input: AmbienteInput): Ambiente
    deleteAmbiente(_id: ID): Ambiente
    updateAmbiente(_id: ID, input: AmbienteInput): Ambiente

    createPlanta(input: PlantaInput): Planta
    deletePlanta(_id: ID!): Planta
    updatePlanta(_id: ID!, input: PlantaInput!): Planta

    createLogA(input: LogInput): LogA
    deleteLogA(_id: ID): LogA
    updateLogA(_id: ID, input: LogInput): LogA


    createLogP(input: LogInput): LogP
    deleteLogP(_id: ID): LogP
    updateLogP(_id: ID, input: LogInput): LogP
}
`

