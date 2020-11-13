require('dotenv').config()
const express = require('express'),
  app = express(),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  errorHandler = require('./handlers/error'),
  authRoutes = require('./routes/auth'),
  messageRoutes = require('./routes/messages'),
  db = require('./models'),
  { loginRequired, ensureCorrectUser } = require('./middleware/auth')

const PORT = 8081

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

// all my routes here - they will come later
app.use('/api/auth', authRoutes)
app.use('/api/users/:id/messages', loginRequired, ensureCorrectUser, messageRoutes)

// temporary
app.get('/', async (req, res) => {
  let response = await db.User.find()

  return res.status(200).send(response)
})

app.get('/api/messages', async (req, res, next) => {
  try {
    let messages = await db.Message.find().sort({ createdAt: 'desc' }).populate('user', {
      username: true,
      profileImageUrl: true
    })
    return res.status(200).json(messages)
  } catch (err) {
    return next(err)
  }
})

// if none of my routes are reached, run this function
app.use((req, res, next) => {
  let err = new Error('Not Found!')
  err.status = 404
  next(err)
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
})