import { Schema, model } from "mongoose";

const logASchema = new Schema({
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
        ref: 'Ambiente'
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

export default model('LogA', logASchema)