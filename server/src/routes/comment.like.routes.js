const express = require('express');
const router = express.Router();
const { toggleCommentLike, getCommentLikes } = require('../controllers/like.controller');
const { authenticate } = require('../middleware/auth');

// POST /api/comments/:commentId/like
router.post('/:commentId/like', authenticate, toggleCommentLike);
// GET  /api/comments/:commentId/likes
router.get('/:commentId/likes', authenticate, getCommentLikes);

module.exports = router;
