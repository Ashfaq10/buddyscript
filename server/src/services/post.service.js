const z = require('zod');

const createPostSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(5000),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
});

const postsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(10),
});

module.exports = { createPostSchema, postsQuerySchema };
