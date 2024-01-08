import { Schema, model, Types } from "mongoose"

const task = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    },
    isDone: {
        type: Boolean,
        default: false
    },
    isNotificatedStart: {
        type: Boolean,
        default: false
    },
    isNotificatedEnd: {
        type: Boolean,
        default: false
    }
})

export default model('Tasks', task)