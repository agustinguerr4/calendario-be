'use strict'
import User from '../models/User'
import Ambiente from '../models/Ambiente'
import Planta from '../models/Planta'
import bcrypt from 'bcrypt'

const fetchUser = async id => {
    try {
        const user = await User.findById(id)
        return user
    } catch (err) {
        return err
    }
}

const fetchAmbiente = async id => {
    try {
        const ambiente = await Ambiente.findById(id)
        return ambiente
    } catch (err) {
        return err
    }
}

export const resolvers = {
    Query: {
        async Users() {
            return await User.find()
        },
        Users: async () => {
            try {
                const users = await User.find().populate('ambientes')
                return users.map(user => {
                    return {...user._doc,
                            password: null}
                })
            } catch (err) {
                throw err;
            }
        },
        Ambientes: async () => {
            try {
                const ambientes = await Ambiente.find().populate('user plantas')
                return ambientes.map(ambiente => {
                    return ambiente
                })
            } catch (err) {
                throw err
            }
        },

        Plantas: async () => {
            try {
                const plantas = await Planta.find().populate('ambiente')
                return plantas.map(planta => {
                    return planta
                })
            }
            catch (err) {
                throw err
            }
        }
    },
    Mutation: {
        createUser: async (_, args) => {
            try {
                const userFind = await User.findOne({ email: args.input.email })
                if (userFind) {
                    throw new Error('El usuario ya existe')
                }
                const hashedPass = await bcrypt.hash(args.input.password, 12)
                const user = new User({
                    email: args.input.email,
                    firstName: args.input.firstName,
                    lastName: args.input.lastName,
                    age: args.input.age,
                    password: hashedPass
                });
                const result = await user.save()

                return result
            } catch (err) {
                throw error
            }
        },
        createAmbiente: async (_, args) => {
            try {
                const user = await User.findById('612ac90c42834af9f75c8aec')
                if (!user) {
                    throw new Error('Usuario no encontrado')
                }

                const ambiente = new Ambiente({
                    nombre: args.input.nombre,
                    tipo: args.input.tipo,
                    tiempo: args.input.tiempo,
                    fecha: new Date(args.input.fecha),
                    user: user
                })

                const result = await ambiente
                    .save()

                user.ambientes.push(ambiente)
                await user.save()
                return result
            }
            catch (err) {
                throw err
            }

        },
        createPlanta: async (_, args) => {
            try {
                const ambiente = await Ambiente.findById("612ac953c9a0e4916e5161a1")

                if (!ambiente) {
                    throw new Error('Ambiente no encontrado')
                }

                const now = new Date();
                const planta = new Planta({
                    nombre: args.input.nombre,
                    origen: args.input.origen,
                    etapa: args.input.etapa,
                    fecha: now.toISOString(),
                    ambiente: ambiente
                })

                const result = await planta
                    .save()
                ambiente.plantas.push(planta)
                await ambiente.save()
                return result
            } catch (err) {
                throw err
            }

        },

        async deleteUser(_, { _id }) {
            return await User.findByIdAndDelete(_id)
        },
        async updateUser(_, { _id, input }) {
            await User.findByIdAndUpdate(_id, input, { new: true })
        },
        async deleteAmbiente(_, { _id }) {
            return await Ambiente.findByIdAndDelete(_id)
        },
        async updateAmbiente(_, { _id, input }) {
            await Ambiente.findByIdAndUpdate(_id, input, { new: true })
        },
        async deletePlanta(_, { _id }) {
            return await Planta.findByIdAndDelete(_id)
        },
        async updatePlanta(_, { _id, input }) {
            await Planta.findByIdAndUpdate(_id, input, { new: true })
        }
    }
}