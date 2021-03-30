const express = require('express'),
  router = express.Router({ mergeParams: true }),
  { createMessage, getMessage, deleteMessage } = require('../handlers/messages')

// /api/users/:id/messages
router.route('/').post(createMessage)
// /api/users/:id/messages/:message_id
router.route('/:message_id').get(getMessage).delete(deleteMessage)

module.exports = router