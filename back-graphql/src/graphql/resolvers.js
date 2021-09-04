'use strict'

import User from '../models/User'
import Ambiente from '../models/Ambiente'
import Planta from '../models/Planta'
import LogA from '../models/LogA'
import LogP from '../models/LogP'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { validateRegisterInput, validateLoginInput } from '../util/validator'
import { AuthenticationError } from 'apollo-server'
import checkAuth from '../util/checkAuth'
import Mongoose from "mongoose";
import 'dotenv/config'

const { UserInputError } = require('apollo-server');


function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, process.env.SECRET_KEY, { expiresIn: '1h' })
}
export const resolvers = {
    Query: {
        async Users(_, req, context) {
            const auth = checkAuth(context)
            if (auth.id) {
                const users = await User.find()
                users.forEach(e => {
                    e.password = null
                })

                return users
            } else {
                return new Error("No estás logueado.")
            }
        },
        async Ambientes(_, nothing, context) {
            const auth = checkAuth(context)
            if (auth.id) {
                const userID = new Mongoose.Types.ObjectId(auth.id)
                return await Ambiente.find({ user: userID }).sort({ createdAt: -1 })
            } else {
                return new Error("No estás logueado.")
            }
        },
        async Plantas(_, nothing, context) {
            const auth = checkAuth(context)
            if (auth.id) {
                const userID = new Mongoose.Types.ObjectId(auth.id)
                // return await Ambiente.find({ user: userID }).sort({ createdAt: -1 })
                return await Planta.find()
            } else {
                return new Error("No estás logueado.")
            }
        },
        async LogsA(_, req, context) {
            const auth = checkAuth(context)
            if (auth.id) {
                const userID = new Mongoose.Types.ObjectId(auth.id)
                // return await Ambiente.find({ user: userID }).sort({ createdAt: -1 })
                return await LogA.find()
            } else {
                return new Error("No estás logueado.")
            }
        },
        async LogsP(_, req, context) {
            const auth = checkAuth(context)
            if (auth.id) {
                const userID = new Mongoose.Types.ObjectId(auth.id)
                // return await Ambiente.find({ user: userID }).sort({ createdAt: -1 })
                return await LogP.find()
            } else {
                return new Error("No estás logueado.")
            }
        },
        // Queries importantes

        // Ambientes
        async getAmbientePorId(_, { id }, context) {
            const auth = checkAuth(context)
            if (auth.id) {
                try {
                    const ambiente = Ambiente.findById(id)
                    return ambiente
                } catch (err) {
                    return error
                }
            } else {
                return new Error("No estás logueado.")
            }
        },
        async getMisAmbientes(_, req, context) {

            const auth = checkAuth(context)
            console.log("buscare los ambientes de: ",auth.id)
            if (auth.id) {
                try {
                    const ambientes = Ambiente.find({ user: auth.id })
                    return ambientes
                } catch (err) {
                    return err
                }
            } else {
                return new Error("No estás logueado.")
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

            const { valid, errors } = validateRegisterInput(
                input.username,
                // input.age,
                input.email,
                input.password,
                input.confirmPassword)



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
            console.log("tengo errores: ",errors)
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
                console.log("tengo errores en valid: ",errors)
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
            const ambientes = await Ambiente.find({ user: _id })
            console.log("Ambientes del usuario: ", ambientes)

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
            const user = await User.findById(auth.id)
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