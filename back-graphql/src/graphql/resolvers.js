'use strict'

import User from '../models/User'
import Ambiente from '../models/Ambiente'
import Planta from '../models/Planta'
import LogA from '../models/LogA'
import LogP from '../models/LogP'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../../config'
import { validateRegisterInput, validateLoginInput } from '../util/validator'
import { AuthenticationError } from 'apollo-server'
import checkAuth from '../util/checkAuth'
import Mongoose from "mongoose";

const { UserInputError } = require('apollo-server');

const userID = "612b98707a16c9835286b3b3"

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h' })
}
export const resolvers = {
    Query: {
        async Users() {
            const users = await User.find()

            users.forEach(e => {
                e.password = null
            })

            return users
        },
        async Ambientes(_, nothing, context) {
            const auth = checkAuth(context)
            const userID = new Mongoose.Types.ObjectId(auth.id)
            return await Ambiente.find({ user: userID }).sort({ createdAt: -1 })
        },
        async Plantas(_, nothing, context) {
            // const auth = checkAuth(context)
            // const plantas = await Planta.find()
            // return plantas
        },
        async LogsA() {
            return await LogsA.find()
        },
        async LogsP() {
            return await LogsP.find()
        },
        // Queries importantes
        // Ambientes
        async getAmbientePorId(_, { id }) {
            try {
                const ambiente = Ambiente.findById(id)
                return ambiente
            } catch (err) {
                return error
            }
        },
        async getMisAmbientes(_, { userID }) {
            try {
                const ambientes = Ambiente.find({ user: userID })
                return ambientes
            } catch (err) {
                return err
            }
        }
    },
    Ambiente: {
        user: ({ user }) => {
            return User.findById(user)
        }
    },
    Planta: {
        ambiente: async ({ ambiente }) => {
            const res = await Ambiente.findById(ambiente)
            return
        }
    },

    // Mutaciones
    Mutation: {
        // USUARIOS
        // Registro
        async createUser(_, { input }, context, info) {
            console.log(input)
            const { valid, errors } = validateRegisterInput(
                input.username,
                // input.age,
                input.email,
                input.password,
                input.confirmPassword)

            console.log("hasta aca errores:",errors)

            if (!valid) {
                return new Error(Object.values(errors))
            }

            const userNameFind = await User.findOne({ username: input.username })
            if (userNameFind) {
                return new Error("Ya existe un usuario con ese nombre.")
            }

            const emailFind = await User.findOne({ email: input.email })
            if (emailFind) {
                return new Error('El correo ya se encuentra registrado')
            }

            input.password = await bcrypt.hash(input.password, 12)

            const newUser = new User({ ...input, createdAt: new Date().toISOString() })
            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                password: null,
                token
            }

        },
        // Login
        async loginUser(_, { input }) {
            const { errors, valid } = validateLoginInput(input.username, input.password)
            if (!valid) {
                return new UserInputError("Errores:", { errors })
            }
            let user = await User.findOne({ username: input.username })
            if (!user) {
                user = await User.findOne({ email: input.username })
                if (!user) {
                    errors.general = "El usuario o e-mail ingresado no se encuentran registrados"
                    return new UserInputError("Error de credenciales", { errors })
                }
            }

            const match = await bcrypt.compare(input.password, user.password)

            if (!match) {
                errors.general = "La contraseña es incorrecta."
                return new UserInputError("Error de credenciales", { errors })
            }


            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                password: 'null',
                token
            }
        },
        async deleteUser(_, { _id }) {
            // Al eliminar un usuario debo eliminar sus ambientes
            return await User.findByIdAndDelete(_id)
        },
        async updateUser(_, { _id, input }) {
            await User.findByIdAndUpdate(_id, input, { new: true })
        },

        //AMBIENTES
        async createAmbiente(_, { input }, context) {
            const auth = checkAuth(context)
            input = {
                ...input,
                user: auth.id,
                createdAt: new Date().toISOString()
            }
            const user = await User.findById(userID)
            const newAmbiente = new Ambiente(input)
            await newAmbiente.save()
            user.ambientes.push(newAmbiente._id)
            await user.save()
            return newAmbiente
        },
        async deleteAmbiente(_, { _id }, context) {
            const auth = checkAuth(context)
            const ambiente = await Ambiente.findById(_id)

            const id = new mongoose.Types.ObjectId(auth.id)
            try {
                if (ambiente.user.equals(id)) {
                    await ambiente.delete()
                    return 'Ambiente eliminado satisfactoriamente'
                } else {
                    return new AuthenticationError('Acción no permitida.')
                }
            } catch (err) {
                return err
            }
        },
        async updateAmbiente(_, { _id, input }) {
            await Ambiente.findByIdAndUpdate(_id, input, { new: true })
        },

        // PLANTAS
        async createPlanta(_, { input }) {
            // tengo que pasarle un ambiente por input
            let ambienteID = "612b98f961c7b12c26a9933a"
            input = { ...input, ambiente: ambienteID }
            const ambiente = await Ambiente.findById(ambienteID)
            const newPlanta = new Planta(input)
            await newPlanta.save()
            ambiente.plantas.push(newPlanta._id)
            await ambiente.save()
            return newPlanta
        },
        async deletePlanta(_, { _id }) {
            return await Planta.findByIdAndDelete(_id)
        },
        async updatePlanta(_, { _id, input }) {
            await Planta.findByIdAndUpdate(_id, input, { new: true })
        },

        // LOGS DE AMBNIENTES
        async createLogA(_, { input }) {
            try {
                let id_parent = "612b98f961c7b12c26a9933a"
                const ambiente = await Ambiente.findById(id_parent)
                const newLog = new LogA({ ...input, id_parent })
                newLog.save()
                ambiente.logs.push(newLog._id)
                ambiente.save()
                return newLog
            } catch (err) {
                return error
            }
        },
        async deleteLogA(_, { _id }) {
            try {
                const id = mongoose.Types.ObjectId(_id);
                const log = await LogA.findById(_id)
                const ambiente = await Ambiente.findById(log.id_parent)
                const index = ambiente.logs.indexOf(id)
                index > -1 && ambiente.logs.splice(index, 1)
                ambiente.save()
                return await LogA.findByIdAndDelete(_id)
            }
            catch (err) {
                return err
            }
        },

        async updateLogA(_, { _id, input }) {
            await LogA.findByIdAndUpdate(_id, input, { new: true })
        },
        async createLogP(_, { input }) {
            try {
                let id_parent = "612b991c02aa5bac7d3f2da1"
                const planta = await Planta.findById(id_parent)
                const newLog = await new LogP({ ...input, id_parent })
                newLog.save()
                planta.logs.push(newLog._id)
                planta.save()
                return newLog
            } catch (err) {
                return error
            }
        },
        async deleteLogP(_, { _id }) {
            try {
                const id = mongoose.Types.ObjectId(_id);
                const log = await LogP.findById(_id)
                const planta = await Planta.findById(log.id_parent)
                const index = planta.logs.indexOf(id)
                index > -1 && planta.logs.splice(index, 1)
                planta.save()
                return await LogP.findByIdAndDelete(_id)
            }
            catch (err) {
                return err
            }
        },
        async updateLogP(_, { _id, input }) {
            await LogP.findByIdAndUpdate(_id, input, { new: true })
        },

    }
}