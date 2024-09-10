const express = require('express')
const router = express.Router()
const Exercise = require('../models/exercises')
const datefns = require('date-fns')
const LogWorkout = require('../models/logWorkout')
const logWorkout = require('../models/logWorkout')


//all exercises Route
router.get('/', async (req, res) => {
    let query = Exercise.find()
    if (req.query.exercise != null && req.query.exercise != '') {
        query = query.regex('exercise', new RegExp(req.query.exercise, 'i'))
    }

    ///THIS ISN'T WORKING GREAT - NEED TO DO SOMETHING ABOUT EMPTY STRING
    if (req.query.reps != null && req.query.reps != '') {
        query = query.regex('reps', new RegExp(req.query.reps, 'i'))
    }
    /* if (req.query.trainingGoal != null && req.query.trainingGoal != '') {
        query = query.regex('trainingGoal', new RegExp(req.query.trainingGoal, 'i'))
    } */
    try {
        const exercises = await query.exec()
        res.render('exercises/index', {
            exercises: exercises,
            searchOptions: req.query
        }) 
    } catch {
        res.redirect('/')
    }
})

//Add new exercise to workout Route - might not be needed
router.get('/new', async (req, res) => {
    renderNewPage(res, new Exercise())
 })
 
 //create exercise Route
 router.post('/', async (req, res) => {
     const exercise = new Exercise({
        //dae: req.query.date,
        exercise: req.body.exercise,  
        sets: req.body.sets,
        reps: req.body.reps,
        weight: req.body.weight,
        comments: req.body.comments,
        logWorkout: req.body.id
     })
     try {
         console.log(exercise.exercise, exercise.sets, exercise.reps, exercise.weight, exercise.comments, exercise.logWorkout )
         //This saves the exercise variable that you created in the post route above
         const newExercise = await exercise.save()
         //res.redirect('exercises/${newExercise.id}')
         res.redirect('exercise')
     } catch (e) {
         //renderNewPage(res, exercise, true)
         console.log(e)
         res.send('create exercise')   
     }
     
 })
 
 async function renderNewPage(res, exercise, hasError = false){
     try {
         const logWorkout = await LogWorkout.find({})
         const params = {
             logWorkout: logWorkout,
             exercise: exercise
         }
         if (hasError) {
             params.errorMessage = 'Error adding Exercise'
         }
         res.render('exercises/new', params)
         //console.err(error)
 
     } catch (e) {
         console.log(e)
         res.redirect('/exercise')
     }
 }


module.exports = router