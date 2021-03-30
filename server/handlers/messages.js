const db = require('../models')

exports.createMessage = async (req, res, next) => {
  try {
    // create a message
    let message = await db.Message.create({
      text: req.body.text,
      user: req.params.id
    })

    // find a user who created a message
    let foundUser = await db.User.findById(req.params.id)
    // save the message to user's message list
    foundUser.messages.push(message.id)

    await foundUser.save()

    let foundMessage = await db.Message.findById(message.id)
      .populate('user', {
        username: true,
        profileImageUrl: true
      })
    return res.status(200).json(foundMessage)
  } catch (err) {
    return next(err)
  }
}

exports.getMessage = async (req, res, next) => {
  try {
    let foundMessage = await db.Message.findById(req.params.message_id)

    return res.status(200).json(foundMessage)
  } catch (err) {
    return next(err)
  }
}

exports.deleteMessage = async (req, res, next) => {
  console.log(req.params.message_id)
  try {
    let foundMessage = await db.Message.findById(req.params.message_id)
    await foundMessage.remove()
    return res.status(200).json(foundMessage)
  } catch (e) {
    return next(e)
  }
}