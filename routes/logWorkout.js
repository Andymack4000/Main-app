const express = require('express')
const router = express.Router()
const LogWorkout = require('../models/logWorkout')
const datefns = require('date-fns')
//const logWorkout = require('../models/logWorkout')
const Exercise = require('../models/exercises')

//all previous workouts
router.get('/', async (req, res) => {

    let searchOptions = {}

    if (req.query.bodyPart != null && req.query.bodyPart !== '') {
        searchOptions.bodyPart = new RegExp(req.query.bodyPart, 'i')
      }

    if (req.query.trainingGoal != null && req.query.trainingGoal !== '') {
        searchOptions.trainingGoal = new RegExp(req.query.trainingGoal, 'i')
      }

    if (req.query.date != null && req.query.date !== '') {
    searchOptions.date = new Date(req.query.date).toISOString()
    console.log(searchOptions.date)
    }

    try{
        
    //console.log(searchOptions.bodyPart, searchOptions.date, searchOptions.trainingGoal)
    const workout = await LogWorkout.find(searchOptions)
    //console.log(workout[0], req.query)
    res.render('logWorkout/index', { logWorkout: workout, searchOptions: req.query})
    } catch (e){
        console.log(e)
        res.redirect('/')
    }
    
})

//create workout
router.post('/', async (req, res) => {
    const logWorkout = new LogWorkout({
        date: req.body.workoutDate,
        bodyPart: req.body.bodyPart,
        trainingGoal: req.body.trainingGoal
        
    })
    
    try {
        console.log('req.body', req.body.workoutDate)
        const newWorkout = await logWorkout.save()
        console.log('logWorkout.date', logWorkout.date)
        res.redirect(`logWorkout/${newWorkout.id}`)
        //res.redirect('logWorkout')
    }
    catch (e) {
        console.log('logWorkout', logWorkout.date)
        console.log(e)
        res.render('logWorkout/new', {
            logWorkout: logWorkout,
            errorMessage: `Something went wrong`
        })
    }  
})

//New Workout
router.get('/new', (req, res) =>{
    res.render('logWorkout/new', {logWorkout: new LogWorkout() })
}) 

//Show Workout
router.get('/:id', async (req, res) => {
    try {
        const logWorkout = await LogWorkout.findById(req.params.id)
        const exercises = await Exercise.find({logWorkout: logWorkout.id}).limit(6).exec()
        res.render('logWorkout/show', {logWorkout: logWorkout, exercises: exercises })
    }
    catch (e){
        console.log(e)
        res.redirect('/')
    }
})

//Edit Workout
router.get('/:id/edit', async (req, res) => {
    
    try {
        const logWorkout = await LogWorkout.findById(req.params.id)
        res.render('logWorkout/edit', {logWorkout: logWorkout })
    }
    catch {
        req.redirect('/logworkout')
    }
})

//Update Workout
router.put('/:id', async (req, res) => {
    let logWorkout   
    try {
        logWorkout = await LogWorkout.findById(req.params.id)
        logWorkout.date = req.body.workoutDate
        //if date = null workoutDate = workoutdate or similar
        logWorkout.bodyPart = req.body.bodyPart
        logWorkout.trainingGoal = req.body.trainingGoal
        await logWorkout.save()
        console.log('logWorkout.date', logWorkout.date)
        res.redirect(`/logWorkout/${logWorkout.id}`)
        //res.redirect('logWorkout')
    }
    catch (e) {
        if (logWorkout == null) {
            res.redirect('/')
        } else {
            res.render('logWorkout/edit', {
                logWorkout: logWorkout,
                errorMessage: e
            })
        }
    }
})

//Delete Workout
router.delete('/:id', async (req, res) => {
    let logWorkout   
    try {
        logWorkout = await LogWorkout.findById(req.params.id)
        await logWorkout.deleteOne()
        res.redirect(`/logWorkout`)
    }
    catch (e) {
        if (logWorkout == null) {
            res.redirect('/')
        } else {
            res.redirect(`/logWorkout/${logWorkout.id}`)
        }
    }
})


module.exports = router