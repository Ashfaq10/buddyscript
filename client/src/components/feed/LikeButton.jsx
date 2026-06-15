"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function LikeButton({ liked, count, type, id, postId, onToggle, isReply, parentId }) {
  const { user } = useAuth();
  const [likeCount, setLikeCount] = useState(count);
  const [isLiked, setIsLiked] = useState(liked);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [likers, setLikers] = useState([]);

  // Sync internal state when parent updates props (e.g. after a new comment is added
  // and the parent re-renders with fresh isLiked/likeCount values).
  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(count);
  }, [liked, count]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const prevLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      let url;
      if (type === "post") url = `/posts/${id}/like`;
      else url = `/comments/${id}/like`;

      const { data } = await api.post(url);
      setIsLiked(data.liked);
      setLikeCount(data.likeCount);
      if (onToggle) onToggle(id, data.liked, data.likeCount);
    } catch {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikers = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      let url;
      if (type === "post") url = `/posts/${id}/likes`;
      else url = `/comments/${id}/likes`;

      const { data } = await api.get(url);
      setLikers(data.users);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch likers", err);
    }
  };

  return (
    <>
      <button
        className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${isLiked ? "_feed_reaction_active" : ""}`}
        onClick={handleToggle}
      >
        <span className="_feed_inner_timeline_reaction_link">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" fill={isLiked ? "#ff4d4f" : "none"} viewBox="0 0 26 24">
              <path
                stroke={isLiked ? "#ff4d4f" : "#666"}
                strokeWidth="1.5"
                d="M13 23.5l-1.77-1.61C4.92 16.1 1 12.76 1 8.57 1 5.09 3.73 2.5 7.08 2.5c1.9 0 3.73.9 4.92 2.31C13.19 3.4 15.02 2.5 16.92 2.5 20.27 2.5 23 5.09 23 8.57c0 4.19-3.92 7.53-10.23 13.32L13 23.5z"
              />
            </svg>
          </span>
        </span>
      </button>
      <button className="_feed_inner_timeline_reaction_emoji _feed_reaction" onClick={fetchLikers} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 8px", fontSize: "14px", color: "#666" }}>
        {likeCount} Like{likeCount !== 1 ? "s" : ""}
      </button>

      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          onClick={() => setShowModal(false)}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content _b_radious6">
              <div className="modal-header">
                <h5 className="modal-title">Liked by</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {likers.length === 0 && <p className="text-muted">No likes yet</p>}
                {likers.map((liker) => (
                  <div key={liker.id} className="d-flex align-items-center mb-2">
                    <img
                      src={liker.avatarUrl || "/assets/images/Avatar.png"}
                      alt=""
                      className="_post_img"
                      style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 12 }}
                    />
                    <span className="_feed_inner_timeline_post_box_title" style={{ fontSize: 14 }}>
                      {liker.firstName} {liker.lastName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
