import { Schema, model } from "mongoose";

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: Number,
        required: true
    },
    tiempo: {
        type: Number,
        required: true
    }
})

export default model('Ambiente', userSchema)