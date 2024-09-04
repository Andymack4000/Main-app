const mongoose = require('mongoose')

const logWorkoutSchema = new mongoose.Schema({
    /* date: {
        type: Date,
        required: true,
        default: Date.now
    }, */
    trainingGoal: {
        type: String,
    },
    bodyPart: {
        type: String
    }
})

module.exports = mongoose.model('LogWorkout', logWorkoutSchema)