import { Schema, model } from "mongoose";

const plantaSchema = new Schema({
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
    },
    fecha: {
        type: Date,
        required: false
    },
    ambiente:
    {
        type: Schema.Types.ObjectId,
        ref: 'Ambiente'
    },
    raza: {
        type: String,
        required: false
    },
    banco: {
        type: String,
        required: false
    },
    tipo: {
        type: Number,
        required: false
    },
    fotoperiodo: {
        type: Number,
        required: false
    },
    ratio: {
        type: String,
        required: false
    },
    floracion: {
        type: Number,
        required: false
    },
    comentario: {
        type: String,
        required: false
    },
    logs:
    [{
        type: Schema.Types.ObjectId,
        ref: 'Log'
    }]

}, { timestamps: true })

export default model('Planta', plantaSchema)