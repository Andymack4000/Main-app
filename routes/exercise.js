const express = require('express')
const router = express.Router()
const Exercise = require('../models/exercises')
const datefns = require('date-fns')
const LogWorkout = require('../models/logWorkout')
//const logWorkout = require('../models/logWorkout')


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

//Add new exercise to workout Route 
router.get('/new', async (req, res) => {
    renderNewPage(res, new Exercise())
 })

 //maybe we need another route to post sets/reps?
 
 //create exercise Route
 router.post('/', async (req, res) => {

    //req.body.reps.forEach()
     const exercise = new Exercise({
        exercise: req.body.exercise,  
        sets: req.body.sets,
        reps: req.body.reps,  //need to send this as an array if poss - Encode reps as json and parse?
        weight: req.body.weight, //need to send this as an array if poss
        comments: req.body.comments,
        logWorkout: req.body.id
     })

     //  Useful info maybe? https://stackoverflow.com/questions/62745055/append-an-array-using-express-node-js-and-mongodb

     //also https://youtube.com/watch?v=iG7py3THA4Q


     try {
         console.log('exwercises logged',exercise.exercise, exercise.sets, exercise.reps, exercise.weight, exercise.comments, exercise.logWorkout)

         if (exercise.sets > 1) {
            router(`/`) //Go to a page where we can add more sets
         } else {
            const newExercise = await exercise.save()
            res.redirect(`exercise/${newExercise.id}`)
         }

         //TRY TO ADD DATE FROM OBJECT ID
         //console.log('should be object id', exercise.logWorkout)  
         //exercise.date = exercise.findById(logWorkout)   
         

         //This saves the exercise variable that you created in the post route above
         
         //res.redirect('exercise')
     } catch (e) {
         //renderNewPage(res, exercise, true)
         console.log(e)
         res.send('create exercise')   
     }
     
 })
 
//Show Exercises route 
router.get('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id).populate().exec()
        res.render('exercises/show', {exercise: exercise})
    }
    catch {
        res.redirect('/')
    }
})

//Edit exercises route
router.get('/:id/edit', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id) 
        console.log('is exercide.id being passed on?', exercise.id, exercise.sets)
        renderEditPage(res, exercise)
    }
    catch {
        res.redirect('/')
    }
    //renderNewPage(res, new Exercise())
})

 //Update exercise Route
 router.put('/:id', async (req, res) => {
    let exercise

    try {   
        exercise = await Exercise.findById(req.params.id)

        exercise.exercise = req.body.exercise  
        exercise.sets = req.body.sets
        exercise.reps = req.body.reps
        exercise.weight = req.body.weight
        exercise.comments = req.body.comments
        exercise.logWorkout = req.body.id

        console.log('Check save object',exercise.weight, exercise.logWorkout)

        //IF DATE ADDED THIS WILL NEED CHANGING TOO 
        await exercise.save()
        res.redirect(`/exercise/${exercise.id}`)
        
    } catch (e) {
        if (exercise != null) {
            renderEditPage(res, exercise, true)
            console.log(e)  
        } else {
            res.redirect('/')
        }
    }   
})

router.delete('/:id', async (req, res) =>{
    
    let exercise 

    try {
        exercise = await Exercise.findById(req.params.id)
        await exercise.deleteOne()
        res.redirect('/exercise')
    } catch (error) {
        if (exercise != null) {
            res.render('exercises/show', {
                exercise: exercise,
                errorMessage: 'Could not delete exercise'
            })
        } else {
            console.log(error)
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, exercise, hasError = false){
     renderFormPage(res, exercise, 'new', hasError)
}

async function renderEditPage(res, exercise, hasError = false){
     renderFormPage(res, exercise, 'edit', hasError)
}

async function renderFormPage(res, exercise, form, hasError = false){
    try {
        const logWorkout = await LogWorkout.find({})
        const params = {
            logWorkout: logWorkout,
            exercise: exercise
        }
        if (hasError){
            if (form === 'edit') {
            params.errorMessage = 'Error editing Exercise'
        } else {
            params.errorMessage = 'Error adding Exercise'
            }
        }
        //console.log('woring?', params)
        res.render(`exercises/${form}`, params)
        //console.err(error)

    } catch (e) {
        console.log(e)
        res.redirect('/exercise')
    }
}



module.exports = router