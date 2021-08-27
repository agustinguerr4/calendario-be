'use strict'
import { tasks } from './example'
import User from './models/User'
import Ambiente from './models/Ambiente'
import Planta from './models/Planta'

export const resolvers = {
    Query: {
        async Users(){
            return await User.find()
        },
        async Ambientes(){
            return await Ambiente.find()
        },
        async Plantas(){
            return await Planta.find()
        }
    },
    Mutation: {
        async createUser(_, { input }) {
            const newUser = new User(input)
            await newUser.save()
            return newUser
        },
        async createAmbiente(_, {input}){
            const newAmbiente = new Ambiente(input)
            await newAmbiente.save()
            return newAmbiente
        },
        async createPlanta(_, {input}){
            const newPlanta = new Planta(input)
            await newPlanta.save()
            return newPlanta
        },
        async deleteUser(_, { _id }){
          return await User.findByIdAndDelete(_id)
        },
        async updateUser(_, {_id, input}){
           await User.findByIdAndUpdate(_id,input, {new: true})
        },
        async deleteAmbiente(_, { _id }){
          return await Ambiente.findByIdAndDelete(_id)
        },
        async updateAmbiente(_, {_id, input}){
           await Ambiente.findByIdAndUpdate(_id,input, {new: true})
        },
        async deletePlanta(_, { _id }){
          return await Planta.findByIdAndDelete(_id)
        },
        async updatePlanta(_, {_id, input}){
           await Planta.findByIdAndUpdate(_id,input, {new: true})
        }
    }
}