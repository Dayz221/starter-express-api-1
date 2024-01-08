import { Schema, model } from "mongoose"

const user = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Tasks'
    }],
    deviceId: {
        type: Schema.Types.Mixed,
        default: null
    }
})

export default model('Users', user)