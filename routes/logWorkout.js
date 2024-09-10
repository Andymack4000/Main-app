const express = require('express')
const router = express.Router()
const LogWorkout = require('../models/logWorkout')
const datefns = require('date-fns')

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
        //res.redirect(`logworkout/${newWorkout.id}`)
        res.redirect('logWorkout')
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


router.get('/new', (req, res) =>{
    //changed here
    res.render('logWorkout/new', {logWorkout: new LogWorkout() })
}) 


module.exports = router