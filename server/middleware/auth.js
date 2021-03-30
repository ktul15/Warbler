require('dotenv').config()
const jwt = require('jsonwebtoken')

// make sure the user is logged - Authentication
exports.loginRequired = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded) {
        return next()
      } else {
        return next({
          status: 403,
          message: 'Please log in first!'
        })
      }
    })
  } catch (err) {
    return next({
      status: 403,
      message: 'Please log in first!'
    })
  }
}

// make sure the user is the correct one - Authorization
exports.ensureCorrectUser = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded && decoded.id === req.params.id) {
        return next()
      } else {
        return next({
          status: 401,
          message: 'Unauthorized!'
        })
      }
    })
  } catch (e) {
    return next({
      status: 401,
      message: 'Unauthorized!'
    })
  }
}