

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateToken = require('./validateToken')
 

const LoginRouter = require('./Login/login-router')
const SearchRouter = require('./Search/search-router')
const DashboardRouter = require('./Dashboard/dashboard-router')
const DetailsRouter = require('./Details/details-router')
const app = express()


app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())
app.get('/',  (req, res) => {
  res.send('Hello, world!')
})

app.get( '/validate', validateToken, (req, res) => {
  return res.status(200).json({});
})


app.use('/api', LoginRouter)
app.use(validateToken)
app.use('/api', SearchRouter)
app.use('/api', DashboardRouter)
app.use('/api', DetailsRouter)









module.exports = app