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
    <div className="_comment_main">
      <div className="_comment_image">
        <a href="#" className="_comment_image_link">
          <img
            src={comment.author?.avatarUrl || "/assets/images/txt_img.png"}
            alt=""
            className="_comment_img1"
          />
        </a>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">{comment.author?.firstName} {comment.author?.lastName}</h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <LikeButton
                    type="comment"
                    id={comment.id}
                    liked={comment.isLiked}
                    count={comment.likeCount}
                    postId={postId}
                    onToggle={updateCommentLikes}
                  />
                </li>
                <li>
                  <button
                    className="_feed_inner_timeline_reaction_comment _feed_reaction"
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    <span className="_feed_inner_timeline_reaction_link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="#666" strokeWidth="1.5" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                      </svg>
                    </span>
                    Reply
                  </button>
                </li>
                <li>
                  <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>{timeAgo(comment.createdAt)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {showReplyInput && (
          <div className="_feed_inner_comment_box" style={{ marginTop: 8 }}>
            <form className="_feed_inner_comment_box_form" onSubmit={handleReply}>
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a reply"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                </div>
              </div>
              <div className="_feed_inner_comment_box_icon">
                <button className="_feed_inner_comment_box_icon_btn" type="submit" disabled={replyLoading}>
                  {replyLoading ? "..." : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path fill="#666" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {comment.replies?.map((reply) => (
          <div key={reply.id} className="_comment_main" style={{ marginLeft: 24, marginTop: 8 }}>
            <div className="_comment_image">
              <a href="#" className="_comment_image_link">
                <img
                  src={reply.author?.avatarUrl || "/assets/images/txt_img.png"}
                  alt=""
                  className="_comment_img1"
                  style={{ width: 30, height: 30 }}
                />
              </a>
            </div>
            <div className="_comment_area">
              <div className="_comment_details">
                <div className="_comment_details_top">
                  <div className="_comment_name">
                    <h4 className="_comment_name_title" style={{ fontSize: 13 }}>
                      {reply.author?.firstName} {reply.author?.lastName}
                    </h4>
                  </div>
                </div>
                <div className="_comment_status">
                  <p className="_comment_status_text">
                    <span>{reply.content}</span>
                  </p>
                </div>
                <div className="_comment_reply">
                  <div className="_comment_reply_num">
                    <ul className="_comment_reply_list">
                      <li>
                        <LikeButton
                          type="comment"
                          id={reply.id}
                          liked={reply.isLiked}
                          count={reply.likeCount}
                          postId={postId}
                          onToggle={updateCommentLikes}
                          isReply
                          parentId={comment.id}
                        />
                      </li>
                      <li>
                        <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>{timeAgo(reply.createdAt)}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
