const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const likeService = {
  async togglePostLike({ postId, userId }) {
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    let liked;
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      await prisma.like.create({ data: { userId, postId } });
      liked = true;
    }

    const likeCount = await prisma.like.count({ where: { postId } });
    return { liked, likeCount };
  },

  async toggleCommentLike({ commentId, userId }) {
    const existing = await prisma.like.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    let liked;
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      await prisma.like.create({ data: { userId, commentId } });
      liked = true;
    }

    const likeCount = await prisma.like.count({ where: { commentId } });
    return { liked, likeCount };
  },

  async getPostLikes(postId) {
    const likes = await prisma.like.findMany({
      where: { postId },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return likes.map((l) => l.user);
  },

  async getCommentLikes(commentId) {
    const likes = await prisma.like.findMany({
      where: { commentId },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return likes.map((l) => l.user);
  },
};

const togglePostLike = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const result = await likeService.togglePostLike({ postId, userId: req.user.id });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const toggleCommentLike = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const result = await likeService.toggleCommentLike({ commentId, userId: req.user.id });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getPostLikes = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);
    const users = await likeService.getPostLikes(postId);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

const getCommentLikes = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const users = await likeService.getCommentLikes(commentId);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

module.exports = { togglePostLike, toggleCommentLike, getPostLikes, getCommentLikes };
