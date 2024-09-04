const express = require('express')
const router = express.Router()
const LogWorkout = require('../models/logWorkout')
const datefns = require('date-fns')
//const logWorkout = require('../models/logWorkout')

//all previous workouts
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.bodyPart != null && req.query.bodyPart !== '') {
        searchOptions.bodyPart = new RegExp(req.query.bodyPart, 'i')
      }
    if (req.query.trainingGoal != null && req.query.trainingGoal !== '') {
        searchOptions.trainingGoal = new RegExp(req.query.trainingGoal, 'i')
      }

      // USE FNS TO MATCH DATE - help here maybe? https://www.squash.io/how-to-use-js-date-fns/

      /* let trainingDate = req.query.date
      if (req.query.date != null && req.query.date !== '') {
        trainingDate = Date.parse(trainingDate)
        trainingDate = new Date(trainingDate).toISOString()
        console.log(trainingDate)
        console.log(datefns.isEqual(trainingDate, req.query.date))
        if (datefns.isEqual(trainingDate, req.query.date)) {
            searchOptions.date = new Date(req.query.date)
        }
      } */
        try{
            
        console.log(searchOptions.bodyPart, searchOptions.date, searchOptions.trainingGoal)
        const workout = await LogWorkout.find(searchOptions)
        console.log(workout[0], req.query)
        res.render('logworkout/index', { logWorkout: workout, searchOptions: req.query})
    } catch (e){
        console.log(e)
        res.redirect('/')
    }
    
})


//create workout
router.post('/', async (req, res) => {
    const logWorkout = new LogWorkout({
        //date: req.body.date,
        bodyPart: req.body.bodyPart,
        trainingGoal: req.body.trainingGoal
    })
    try {
        console.log(logWorkout)
        const newWorkout = await logWorkout.save()
        console.log(logWorkout)
        //res.redirect(`logworkout/${newWorkout.id}`)
        res.redirect('logworkout')
    }
    catch (e) {
        console.log(e)
        res.render('logworkout/new', {
            logWorkout: logWorkout,
            errorMessage: `Something went wrong`
        })
    }  
})


router.get('/new', (req, res) =>{
    res.render('logworkout/new', {logWorkout: new LogWorkout() })
}) 


module.exports = router