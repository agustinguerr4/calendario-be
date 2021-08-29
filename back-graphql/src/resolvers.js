'use strict'

import User from './models/User'
import Ambiente from './models/Ambiente'
import Planta from './models/Planta'
import LogA from './models/LogA'
import LogP from './models/LogP'
import mongoose from 'mongoose'

export const resolvers = {
    Query: {
        async Users() {
            return await User.find()
        },
        async Ambientes() {
            return await Ambiente.find()
        },
        async Plantas() {
            return await Planta.find()
        },
        async LogsA() {
            return await LogsA.find()
        },
        async LogsP() {
            return await LogsP.find()
        }
    },
    Ambiente: {
        user: ({ user }) => {
            return User.findById(user)
        }
    },

    // Mutaciones
    Mutation: {
        // USUARIOS
        async createUser(_, { input }) {
            const userFind = await User.findOne({ email: input.email })
            if (!userFind) {
                const newUser = new User(input)
                await newUser.save()
                return newUser
            } else {
                return new Error("El correo ya se encuentra registrado")
            }

        },
        async deleteUser(_, { _id }) {
            return await User.findByIdAndDelete(_id)
        },
        async updateUser(_, { _id, input }) {
            await User.findByIdAndUpdate(_id, input, { new: true })
        },

        //AMBIENTES
        async createAmbiente(_, { input }) {
            let userID = "612b98707a16c9835286b3b3"
            // aca debo pasarle el ID del usuario actualmente logueado
            input = { ...input, user: userID }
            const user = await User.findById(userID)
            const newAmbiente = new Ambiente(input)
            await newAmbiente.save()
            user.ambientes.push(newAmbiente._id)
            await user.save()
            return newAmbiente
        },
        async deleteAmbiente(_, { _id }) {
            return await Ambiente.findByIdAndDelete(_id)
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
                const newLog = new LogA({...input, id_parent})
                newLog.save()
                ambiente.logs.push(newLog._id)
                ambiente.save() 
                return newLog
            } catch (err) {
                return error
            }
        },
        async deleteLogA(_, { _id }) {
            try{ const id = mongoose.Types.ObjectId(_id);
             const log = await LogA.findById(_id)
             const ambiente = await Ambiente.findById(log.id_parent)
             const index = ambiente.logs.indexOf(id)
             index > -1 && ambiente.logs.splice(index,1)
             ambiente.save()
             return await LogA.findByIdAndDelete(_id)}
             catch(err){
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
                const newLog = await new LogP({...input, id_parent})
                newLog.save()
                planta.logs.push(newLog._id)
                planta.save() 
                return newLog
            } catch (err) {
                return error
            }
        },
        async deleteLogP(_, { _id }) {
           try{ const id = mongoose.Types.ObjectId(_id);
            const log = await LogP.findById(_id)
            const planta = await Planta.findById(log.id_parent)
            const index = planta.logs.indexOf(id)
            index > -1 && planta.logs.splice(index,1)
            planta.save()
            return await LogP.findByIdAndDelete(_id)}
            catch(err){
                return err
            }
        },
        async updateLogP(_, { _id, input }) {
            await LogP.findByIdAndUpdate(_id, input, { new: true })
        },
        
    }
}