if (process.env.NODE_ENV != 'production') {require('dotenv').config()}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
 

const indexRouter = require('./routes/index')
const logWorkOutRouter = require('./routes/logWorkout')
const exerciseRouter = require('./routes/exercise')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to mongoose'))

app.use('/', indexRouter)
app.use('/logWorkout', logWorkOutRouter)
app.use('/exercise', exerciseRouter)




app.listen(process.env.PORT || 3002)

