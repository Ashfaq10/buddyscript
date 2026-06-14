"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useComments } from "@/hooks/useComments";
import Comment from "./Comment";

export default function CommentSection({ postId, onCommentAdded }) {
  const { user } = useAuth();
  const { comments, fetchComments, loadMoreComments, addComment, addReply, updateCommentLikes } = useComments(postId);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const commentState = comments[postId];
  const items = commentState?.items || [];
  const hasMore = !!commentState?.nextCursor;
  const totalHidden = items.length > 0 ? commentState.nextCursor ? "+" : "" : "";

  useEffect(() => {
    if (showComments && !commentState) {
      fetchComments(postId);
    }
  }, [showComments, postId, commentState, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment(postId, content.trim());
      setContent("");
      if (onCommentAdded) onCommentAdded(postId);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (commentId, replyContent, pId) => {
    await addReply(commentId, replyContent, pId);
  };

  return (
    <div className="_feed_inner_timeline_cooment_area">
      <div className="_feed_inner_comment_box">
        <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
          <div className="_feed_inner_comment_box_content">
            <div className="_feed_inner_comment_box_content_image">
              <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
            </div>
            <div className="_feed_inner_comment_box_content_txt">
              <textarea
                className="form-control _comment_textarea"
                placeholder="Write a comment"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <div className="_feed_inner_comment_box_icon">
            <button className="_feed_inner_comment_box_icon_btn" type="submit" disabled={submitting}>
              {submitting ? "..." : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path fill="#666" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="_timline_comment_main">
        {!showComments && items.length === 0 && (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt" onClick={() => setShowComments(true)}>
              View comments
            </button>
          </div>
        )}

        {showComments && hasMore && (
          <div className="_previous_comment">
            <button
              type="button"
              className="_previous_comment_txt"
              onClick={() => loadMoreComments(postId)}
            >
              View previous comments {totalHidden}
            </button>
          </div>
        )}

        {items.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={postId}
            onReply={handleReply}
            updateCommentLikes={updateCommentLikes}
          />
        ))}

        {!showComments && items.length > 0 && (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt" onClick={() => setShowComments(true)}>
              View {items.length} comments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
