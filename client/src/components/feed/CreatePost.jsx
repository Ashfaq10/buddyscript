"use client";

import { useState, useRef } from "react";

export default function CreatePost({ onSubmit }) {
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
        <div className="d-flex align-items-center mb-3">
          <img
            src="/assets/images/post_img.png"
            alt=""
            className="_post_img"
            style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 12 }}
          />
          <div style={{ flex: 1 }}>
            <textarea
              className="form-control _textarea"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ border: "none", boxShadow: "none", resize: "none", fontSize: 14 }}
              rows={2}
            />
          </div>
        </div>

        {preview && (
          <div className="_feed_inner_timeline_image mb-3" style={{ position: "relative" }}>
            <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8 }} />
            <button
              onClick={() => { setImage(null); setPreview(null); }}
              style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer" }}
            >
              x
            </button>
          </div>
        )}
      </div>

      <div className="_feed_inner_timeline_reaction _padd_r24 _padd_l24">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center" style={{ gap: 12 }}>
            <button
              className="_feed_inner_timeline_reaction_comment _feed_reaction"
              onClick={() => fileRef.current?.click()}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#666" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                <path stroke="#666" strokeWidth="1.5" d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
                <circle cx="8.5" cy="8.5" r="1.5" stroke="#666" strokeWidth="1.5" />
                <path stroke="#666" strokeWidth="1.5" d="M21 15l-5-5L5 21" />
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
                className="_feed_inner_timeline_reaction_comment _feed_reaction dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                style={{ background: "none", border: "none", fontSize: 14, color: "#666" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                  <path stroke="#666" strokeWidth="1.5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path stroke="#666" strokeWidth="1.5" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path stroke="#666" strokeWidth="1.5" d="M2 12h20" />
                </svg>
                {visibility === "PUBLIC" ? "Public" : "Private"}
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => setVisibility("PUBLIC")}>Public</button></li>
                <li><button className="dropdown-item" onClick={() => setVisibility("PRIVATE")}>Private</button></li>
              </ul>
            </div>
          </div>

          <button
            className="_social_login_form_btn_link _btn1"
            onClick={handleSubmit}
            disabled={posting || !content.trim()}
            style={{ padding: "6px 24px", fontSize: 14, opacity: posting || !content.trim() ? 0.6 : 1 }}
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
