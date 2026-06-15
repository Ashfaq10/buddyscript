const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/post.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createPostSchema } = require('../services/post.service');
const { upload } = require('../middleware/upload');

// Custom multer error handler — returns 400 instead of 500
const uploadWithErrorHandling = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.get('/', authenticate, postController.getFeed);
router.post('/', authenticate, uploadWithErrorHandling, validate(createPostSchema), postController.create);
router.delete('/:id', authenticate, postController.remove);

module.exports = router;
