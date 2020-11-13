const db = require('../models')
const jwt = require('jsonwebtoken')

exports.signin = async function (req, res, next) {
  try {
    const { email, password } = req.body
    // finding a user
    let user = await db.User.findOne({ email: email })

    const { username, id, profileImageUrl } = user
    // check if password matches
    let isMatch = await user.comparePassword(password)
    // if it matches then log them in
    if (isMatch) {
      let token = jwt.sign({
        id,
        username,
        profileImageUrl
      }, process.env.SECRET_KEY,
        {
          expiresIn: '1h'
        })
      return res.status(200).send({
        id, username, profileImageUrl, token
      })
    } else {
      return next({
        status: 400,
        message: 'Invalid Email/Password!'
      })
    }
  } catch (err) {
    return next({
      status: 400,
      message: 'Invalid Email/Password!'
    })
  }
}

exports.signup = async function (req, res, next) {
  try {
    // create a user
    let user = await db.User.create(req.body)
    const { id, username, profileImageUrl } = user
    // create a token (signing a token)
    let token = jwt.sign({
      id,
      username,
      profileImageUrl
    }, process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      }
    )
    return res.status(200).json({
      id, username, profileImageUrl, token
    })
  } catch (err) {
    if (err.code == 11000) {
      err.message = 'Sorry, that username and/or email is taken'
    }
    return next({
      status: 400,
      message: err.message
    })
  }
}