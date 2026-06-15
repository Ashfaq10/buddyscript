"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function CreatePost({ onSubmit }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || posting) return;
    setPosting(true);
    try {
      await onSubmit(content, image, visibility);
      setContent("");
      setImage(null);
      setPreview(null);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="d-flex align-items-start gap-3 mb-3">
          <img
            src={user?.avatarUrl || "/assets/images/post_img.png"}
            alt=""
            className="_post_img"
            style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid #e0e0e0" }}
          />
          <div style={{ flex: 1 }}>
            <textarea
              className="form-control"
              placeholder={`What's on your mind, ${user?.firstName}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 18,
                background: "#F0F2F5",
                resize: "none",
                fontSize: 14,
                padding: "10px 16px",
                boxShadow: "none",
                width: "100%",
              }}
            />
          </div>
        </div>

        {preview && (
          <div className="mb-3" style={{ position: "relative" }}>
            <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8 }} />
            <button
              onClick={() => { setImage(null); setPreview(null); }}
              style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}
            >
              x
            </button>
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_reaction _padd_r24 _padd_l24" style={{ borderTop: "1px solid #e0e0e0", paddingTop: 12, marginTop: 16 }}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="d-flex align-items-center gap-1"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#65676b", padding: "8px 16px", borderRadius: 8 }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F0F2F5"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path fill="#45BD62" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="#fff" />
                <path fill="#fff" d="M21 15l-5-5L5 21" />
              </svg>
              Photo
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <div className="dropdown">
              <button
                className="d-flex align-items-center gap-1 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#65676b", padding: "8px 16px", borderRadius: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F0F2F5"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path stroke="#65676b" strokeWidth="1.5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path stroke="#65676b" strokeWidth="1.5" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path stroke="#65676b" strokeWidth="1.5" d="M2 12h20" />
                </svg>
                {visibility === "PUBLIC" ? "Public" : "Private"}
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" type="button" onClick={() => setVisibility("PUBLIC")}>Public</button></li>
                <li><button className="dropdown-item" type="button" onClick={() => setVisibility("PRIVATE")}>Private</button></li>
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={posting || !content.trim()}
            style={{
              background: posting || !content.trim() ? "#B0C4DE" : "#1890FF",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 28px",
              fontSize: 14,
              fontWeight: 600,
              cursor: posting || !content.trim() ? "default" : "pointer",
            }}
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
