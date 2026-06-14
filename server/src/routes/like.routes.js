const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const { authenticate } = require('../middleware/auth');

router.post('/:postId/like', authenticate, likeController.togglePostLike);
router.get('/:postId/likes', authenticate, likeController.getPostLikes);
router.post('/:commentId/like', authenticate, likeController.toggleCommentLike);
router.get('/:commentId/likes', authenticate, likeController.getCommentLikes);

module.exports = router;
