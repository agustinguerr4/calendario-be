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
    },
    user:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    plantas:
    [{
        type: Schema.Types.ObjectId,
        ref: 'Planta'
    }],
    logs:
    [{
        type: Schema.Types.ObjectId,
        ref: 'Log'
    }]
}, { timestamps: true }
)


export default model('Ambiente', userSchema)