const errorHandler = (error, req, res, next) => {
  return res.status(error.status || 500).send({
    error: {
      message: error.message || "Oops! Something went wrong."
    }
  })
}

module.exports = errorHandler