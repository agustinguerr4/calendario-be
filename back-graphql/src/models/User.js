import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    // age: {
    //     type: Number,
    //     required: true
    // },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ambientes: [{
        type: Schema.Types.ObjectId,
        ref: 'Ambiente'
    }]
    
}, { timestamps: true })

export default model('User', userSchema)