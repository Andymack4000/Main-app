const express = require('express')
const router = express.Router()
const Exercises = require('../models/exercises')
const datefns = require('date-fns')
const LogWorkout = require('../models/logWorkout')

//all exercises Route
router.get('/', async (req, res) => {
   res.send('All exercises') 
})

//Add new exercise to workout Route - might not be needed
router.get('/new', async (req, res) => {
    try {
        const logWorkout = await LogWorkout.find({})
        const exercise = new Exercises()
        res.render('exercises/new', {
            logWorkout: logWorkout,
            exercise: exercise
        })
        console.log(exercise)

    } catch {
   res.redirect('/exercise')
    }
})

//create exercise Route
router.post('/', async (req, res) => {
    const exercise = new Exercises({
        exercise: req.body.exercise,
        sets: req.body.sets,
        reps: req.body.reps,
        weight: req.body.weight,
        comments: req.body.comments

        /* exercise: 'Bench',
        sets: 5,
        reps: 5,
        weight: 5,
        comments: "nones" */
    })
    try {
        console.log(typeof exercise.exercise, exercise.sets, exercise.reps, exercise.weight, exercise.comments )
        //This saves the exercise variable that you created in the post route above
        const newExercise = await exercise.save()
        console.log(newExercise)
        //res.redirect('exercises/${newExercise.id}')
        res.redirect('exercise')
    } catch {}
    //res.send('create exercise')   
})


module.exports = router