const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
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
        
    },
    logWorkout: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'LogWorkout'
    }
})

//IF CODE BREAKS TRY RESETING THIS TO 'Exercise'
module.exports = mongoose.model('Exercise', exerciseSchema)