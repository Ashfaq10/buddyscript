"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

export default function PostCard({ post, onDelete, onLikeToggle, onCommentAdded }) {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleDelete = async () => {
    if (confirm("Delete this post?")) {
      onDelete(post.id);
    }
    setShowDropdown(false);
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img
                src={post.author?.avatarUrl || "/assets/images/post_img.png"}
                alt=""
                className="_post_img"
              />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">
                {post.author?.firstName} {post.author?.lastName}
                {post.visibility === "PRIVATE" && (
                  <span style={{ fontSize: 11, color: "#999", marginLeft: 6 }}>
                    (Private)
                  </span>
                )}
              </h4>
              <p className="_feed_inner_timeline_post_box_para">{timeAgo(post.createdAt)}</p>
            </div>
          </div>

          {post.author?.id === user?.id && (
            <div className="_feed_inner_timeline_post_box_dropdown">
              <div className="_feed_timeline_post_dropdown">
                <button
                  className="_feed_timeline_post_dropdown_link"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="_feed_timeline_dropdown _timeline_dropdown show" style={{ position: "absolute", right: 0, zIndex: 10 }}>
                    <ul className="_feed_timeline_dropdown_list">
                      <li className="_feed_timeline_dropdown_item">
                        <button
                          className="_feed_timeline_dropdown_link"
                          onClick={handleDelete}
                          style={{ color: "red", background: "none", border: "none", width: "100%", textAlign: "left", padding: "8px 16px", cursor: "pointer" }}
                        >
                          Delete Post
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <h4 className="_feed_inner_timeline_post_title" style={{ fontSize: 16, marginTop: 12, color: "#333" }}>
          {post.content}
        </h4>

        {post.imageUrl && (
          <div className="_feed_inner_timeline_image">
            <img src={post.imageUrl} alt="Post" style={{ width: "100%", borderRadius: 8, marginTop: 12 }} />
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26" style={{ marginTop: 16 }}>
        <div className="_feed_inner_timeline_total_reacts_image">
          <img src="/assets/images/react_img1.png" alt="" className="_react_emoji" />
          <img src="/assets/images/react_img2.png" alt="" className="_react_emoji" />
          <img src="/assets/images/react_img3.png" alt="" className="_react_emoji" />
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span>{post.likeCount}</span> Likes
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>{post.commentCount}</span> Comments
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <LikeButton
          type="post"
          id={post.id}
          liked={post.isLiked}
          count={post.likeCount}
          postId={post.id}
          onToggle={(id, liked) => onLikeToggle(post.id, liked)}
        />
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#666" }}>
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="#666" strokeWidth="1.5" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </span>
            {post.commentCount} Comment{post.commentCount !== 1 ? "s" : ""}
          </span>
        </button>
      </div>

      <CommentSection postId={post.id} onCommentAdded={onCommentAdded} />
    </div>
  );
}
