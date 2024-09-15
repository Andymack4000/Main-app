const mongoose = require('mongoose')
const Exercise = require('./exercises')

const logWorkoutSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    trainingGoal: {
        type: String,
    },
    bodyPart: {
        type: String
    }
    
})

logWorkoutSchema.pre(
    "deleteOne", { 
        document: true, 
        query: false 
    },
    async function (next) {
      try {
        const exercises = await Exercise.find({ logWorkout: this._id }).exec();
        console.log(exercises);
        if (exercises.length > 0) {
          next(new Error("This workout has exercises attached"));
        } else {
          next();
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );

module.exports = mongoose.model('LogWorkout', logWorkoutSchema)