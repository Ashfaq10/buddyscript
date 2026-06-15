const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const commentService = {
  async getComments({ postId, userId, cursor, limit }) {
    const where = { postId, parentId: null };

    if (cursor) {
      where.createdAt = { lt: new Date(parseInt(cursor)) };
    }

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: limit + 1,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        _count: { select: { likes: true, replies: true } },
        likes: { where: { userId }, select: { id: true } },
        replies: {
          include: {
            author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            _count: { select: { likes: true } },
            likes: { where: { userId }, select: { id: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const hasMore = comments.length > limit;
    const data = hasMore ? comments.slice(0, limit) : comments;

    const formatted = data.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: comment.author,
      likeCount: comment._count.likes,
      isLiked: comment.likes.length > 0,
      replyCount: comment._count.replies,
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        author: reply.author,
        likeCount: reply._count.likes,
        isLiked: reply.likes.length > 0,
      })),
    }));

    return {
      comments: formatted,
      nextCursor: hasMore ? String(data[data.length - 1].createdAt.getTime()) : null,
    };
  },

  async create({ content, postId, authorId }) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      const err = new Error('Post not found');
      err.status = 404;
      throw err;
    }

    const comment = await prisma.comment.create({
      data: { content, postId, authorId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        _count: { select: { likes: true, replies: true } },
        replies: { include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }, _count: { select: { likes: true } } } },
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: comment.author,
      likeCount: comment._count.likes,
      isLiked: false,
      replyCount: comment._count.replies,
      replies: [],
    };
  },

  async createReply({ content, commentId, authorId }) {
    const parent = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!parent) {
      const err = new Error('Comment not found');
      err.status = 404;
      throw err;
    }

    const reply = await prisma.comment.create({
      data: { content, postId: parent.postId, authorId, parentId: commentId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        _count: { select: { likes: true } },
      },
    });

    return {
      id: reply.id,
      content: reply.content,
      createdAt: reply.createdAt,
      parentId: commentId,
      author: reply.author,
      likeCount: reply._count.likes,
      isLiked: false,
    };
  },
};

const getComments = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const { cursor, limit } = req.query;
    const result = await commentService.getComments({
      postId,
      userId: req.user.id,
      cursor,
      limit: Math.min(limit ? parseInt(limit) : 5, 50),
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const comment = await commentService.create({
      content: req.body.content,
      postId,
      authorId: req.user.id,
    });
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};

const createReply = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const reply = await commentService.createReply({
      content: req.body.content,
      commentId,
      authorId: req.user.id,
    });
    res.status(201).json({ reply });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, createComment, createReply };
