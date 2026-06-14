"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (cursor) => {
    setLoading(true);
    try {
      const params = { limit: 10 };
      if (cursor) params.cursor = cursor;

      const { data } = await api.get("/posts", { params });

      if (cursor) {
        setPosts((prev) => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (nextCursor && !loading) {
      fetchPosts(nextCursor);
    }
  }, [nextCursor, loading, fetchPosts]);

  const createPost = async (content, image, visibility) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("visibility", visibility);
    if (image) formData.append("image", image);

    const { data } = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setPosts((prev) => [data.post, ...prev]);
    return data.post;
  };

  const removePost = async (postId) => {
    await api.delete(`/posts/${postId}`);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const updatePostLikes = (postId, liked) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: liked, likeCount: liked ? p.likeCount + 1 : p.likeCount - 1 }
          : p
      )
    );
  };

  const updatePostComments = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
      )
    );
  };

  return { posts, loading, nextCursor, fetchPosts, loadMore, createPost, removePost, updatePostLikes, updatePostComments };
}
