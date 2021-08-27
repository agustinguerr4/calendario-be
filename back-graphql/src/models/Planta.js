import { Schema, model } from "mongoose";

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    origen: {
        type: Number,
        required: true
    },
    etapa: {
        type: Number,
        required: true
    }
})

export default model('Planta', userSchema)