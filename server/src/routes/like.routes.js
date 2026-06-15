const express = require('express');
const router = express.Router();
const { togglePostLike, getPostLikes } = require('../controllers/like.controller');
const { authenticate } = require('../middleware/auth');

// POST /api/posts/:postId/like
router.post('/:postId/like', authenticate, togglePostLike);
// GET  /api/posts/:postId/likes
router.get('/:postId/likes', authenticate, getPostLikes);

module.exports = router;
