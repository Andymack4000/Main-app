const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
    bodyPart: {
        type: String,
        required: true
    },
    workoutType: {
        type: String,
        required: true
    },
    exercise: {
    type: String,
    required: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Array,
        required: true
    },
    weight:{
        type: Array,
        required: true
    },
    comments: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Exercise', exerciseSchema)