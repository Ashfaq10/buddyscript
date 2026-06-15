"use client";

import { useState } from "react";
import api from "@/lib/api";

export function useComments(postId) {
  const [comments, setComments] = useState({});

  const fetchComments = async (pId) => {
    try {
      const { data } = await api.get(`/posts/${pId}/comments`, { params: { limit: 5 } });
      setComments((prev) => ({ ...prev, [pId]: { items: data.comments, nextCursor: data.nextCursor } }));
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const loadMoreComments = async (pId) => {
    const state = comments[pId];
    if (!state?.nextCursor) return;

    try {
      const { data } = await api.get(`/posts/${pId}/comments`, {
        params: { limit: 5, cursor: state.nextCursor },
      });
      setComments((prev) => ({
        ...prev,
        [pId]: {
          items: [...prev[pId].items, ...data.comments],
          nextCursor: data.nextCursor,
        },
      }));
    } catch (err) {
      console.error("Failed to load more comments", err);
    }
  };

  const addComment = async (pId, content) => {
    const { data } = await api.post(`/posts/${pId}/comments`, { content });
    setComments((prev) => {
      const existing = prev[pId]?.items || [];
      return { ...prev, [pId]: { items: [data.comment, ...existing], nextCursor: prev[pId]?.nextCursor } };
    });
    return data.comment;
  };

  const addReply = async (commentId, content, pId) => {
    const { data } = await api.post(`/comments/${commentId}/replies`, { content });
    setComments((prev) => {
      const items = (prev[pId]?.items || []).map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, data.reply], replyCount: c.replyCount + 1 }
          : c
      );
      return { ...prev, [pId]: { ...prev[pId], items } };
    });
    return data.reply;
  };

  const updateCommentLikes = (pId, commentId, liked, likeCount, isReply = false, parentId = null) => {
    setComments((prev) => {
      const items = (prev[pId]?.items || []).map((c) => {
        if (!isReply && c.id === commentId) {
          return { ...c, isLiked: liked, likeCount };
        }
        if (isReply && c.id === parentId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId
                ? { ...r, isLiked: liked, likeCount }
                : r
            ),
          };
        }
        return c;
      });
      return { ...prev, [pId]: { ...prev[pId], items } };
    });
  };

  return { comments, fetchComments, loadMoreComments, addComment, addReply, updateCommentLikes };
}
