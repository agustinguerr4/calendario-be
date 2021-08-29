import { Schema, model } from "mongoose";

const logPSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: false
    },
    id_parent: {
        type: Schema.Types.ObjectId,
        ref: 'Planta'
    },
    comentario:{
        type: String,
        required: false
    },
    recurrencia: {
        type: Boolean,
        required: false
    }
    
}, { timestamps: true })

export default model('LogP', logPSchema)