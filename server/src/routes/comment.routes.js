const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createCommentSchema } = require('../services/comment.service');

router.get('/:postId/comments', authenticate, commentController.getComments);
router.post('/:postId/comments', authenticate, validate(createCommentSchema), commentController.createComment);
router.post('/:commentId/replies', authenticate, validate(createCommentSchema), commentController.createReply);

module.exports = router;
