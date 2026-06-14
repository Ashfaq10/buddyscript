const z = require('zod');

const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(2000),
});

module.exports = { createCommentSchema };
