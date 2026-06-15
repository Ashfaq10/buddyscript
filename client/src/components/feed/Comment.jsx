"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LikeButton from "./LikeButton";

export default function Comment({ comment, postId, onReply, updateCommentLikes }) {
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || replyLoading) return;
    setReplyLoading(true);
    try {
      await onReply(comment.id, replyContent.trim(), postId);
      setReplyContent("");
      setShowReplyInput(false);
    } finally {
      setReplyLoading(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {/* ── Main comment row ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0 }}>
          <img
            src={comment.author?.avatarUrl || "/assets/images/post_img.png"}
            alt=""
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "1px solid #e0e0e0" }}
          />
        </div>

        {/* Bubble + actions */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Comment bubble */}
          <div style={{
            background: "#F0F2F5",
            borderRadius: 18,
            padding: "8px 14px",
            display: "inline-block",
            maxWidth: "100%",
          }}>
            <p style={{ fontWeight: 600, fontSize: 13, color: "#1c1e21", margin: "0 0 2px" }}>
              {comment.author?.firstName} {comment.author?.lastName}
            </p>
            <p style={{ fontSize: 14, color: "#3c4043", margin: 0, wordBreak: "break-word", lineHeight: 1.4 }}>
              {comment.content}
            </p>
          </div>

          {/* Action bar: Like · Reply · Timestamp */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, paddingLeft: 4 }}>
            <LikeButton
              type="comment"
              id={comment.id}
              liked={comment.isLiked}
              count={comment.likeCount}
              postId={postId}
              onToggle={(commentId, liked, likeCount) => updateCommentLikes(postId, commentId, liked, likeCount)}
            />
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, color: "#65676b", padding: 0,
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path stroke="#65676b" strokeWidth="1.8" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              Reply
            </button>
            <span style={{ fontSize: 11, color: "#aaa" }}>{timeAgo(comment.createdAt)}</span>
          </div>

          {/* Reply input */}
          {showReplyInput && (
            <form onSubmit={handleReply} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <img
                src={user?.avatarUrl || "/assets/images/post_img.png"}
                alt=""
                style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#F0F2F5", borderRadius: 20, padding: "4px 12px" }}>
                <textarea
                  rows={1}
                  placeholder="Write a reply…"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  style={{
                    flex: 1, border: "none", background: "transparent", outline: "none",
                    fontSize: 13, resize: "none", lineHeight: 1.5, color: "#3c4043",
                  }}
                />
                <button
                  type="submit"
                  disabled={replyLoading}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 0 6px", flexShrink: 0 }}
                >
                  {replyLoading ? (
                    <span style={{ fontSize: 12, color: "#888" }}>…</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path fill="#1890FF" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies?.map((reply) => (
            <div key={reply.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 10, paddingLeft: 8 }}>
              <img
                src={reply.author?.avatarUrl || "/assets/images/post_img.png"}
                alt=""
                style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid #e0e0e0" }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  background: "#F0F2F5",
                  borderRadius: 16,
                  padding: "6px 12px",
                  display: "inline-block",
                  maxWidth: "100%",
                }}>
                  <p style={{ fontWeight: 600, fontSize: 12, color: "#1c1e21", margin: "0 0 2px" }}>
                    {reply.author?.firstName} {reply.author?.lastName}
                  </p>
                  <p style={{ fontSize: 13, color: "#3c4043", margin: 0, wordBreak: "break-word", lineHeight: 1.4 }}>
                    {reply.content}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3, paddingLeft: 4 }}>
                  <LikeButton
                    type="comment"
                    id={reply.id}
                    liked={reply.isLiked}
                    count={reply.likeCount}
                    postId={postId}
                    onToggle={(replyId, liked, likeCount) => updateCommentLikes(postId, replyId, liked, likeCount, true, comment.id)}
                    isReply
                    parentId={comment.id}
                  />
                  <span style={{ fontSize: 11, color: "#aaa" }}>{timeAgo(reply.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
