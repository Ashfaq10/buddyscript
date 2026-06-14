const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const postService = {
  async getFeed({ userId, cursor, limit }) {
    const where = {
      OR: [
        { visibility: 'PUBLIC' },
        { authorId: userId, visibility: 'PRIVATE' },
      ],
    };

    if (cursor) {
      where.createdAt = { lt: new Date(parseInt(cursor)) };
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        _count: { select: { comments: true, likes: true } },
        likes: { where: { userId }, select: { id: true } },
      },
    });

    const hasMore = posts.length > limit;
    const result = hasMore ? posts.slice(0, limit) : posts;

    const formatted = result.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      visibility: post.visibility,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author,
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      isLiked: post.likes.length > 0,
    }));

    return {
      posts: formatted,
      nextCursor: hasMore ? String(result[result.length - 1].createdAt.getTime()) : null,
    };
  },

  async create({ content, imageUrl, visibility, authorId }) {
    const post = await prisma.post.create({
      data: { content, imageUrl, visibility, authorId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    return {
      id: post.id,
      content: post.content,
      imageUrl: post.imageUrl,
      visibility: post.visibility,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author,
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      isLiked: false,
    };
  },

  async delete(postId, userId) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      const err = new Error('Post not found');
      err.status = 404;
      throw err;
    }
    if (post.authorId !== userId) {
      const err = new Error('Not authorized to delete this post');
      err.status = 403;
      throw err;
    }

    await prisma.post.delete({ where: { id: postId } });
  },
};

const getFeed = async (req, res, next) => {
  try {
    const { cursor, limit } = req.query;
    const result = await postService.getFeed({
      userId: req.user.id,
      cursor,
      limit: limit ? parseInt(limit) : 10,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    let imageUrl = null;
    if (req.file) {
      const { uploadToCloudinary } = require('../middleware/upload');
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const visibility = req.body.visibility || 'PUBLIC';
    const post = await postService.create({
      content: req.body.content,
      imageUrl,
      visibility,
      authorId: req.user.id,
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await postService.delete(parseInt(req.params.id), req.user.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFeed, create, remove };
