"use client";

import { useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Navbar from "@/components/feed/Navbar";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import { usePosts } from "@/hooks/usePosts";

function FeedContent() {
  const { posts, loading, fetchPosts, createPost, removePost, updatePostLikes, updatePostComments } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (content, image, visibility) => {
    await createPost(content, image, visibility);
  };

  const handleLikeToggle = useCallback((postId, liked, likeCount) => {
    updatePostLikes(postId, liked, likeCount);
  }, [updatePostLikes]);

  const handleCommentAdded = useCallback((postId) => {
    updatePostComments(postId);
  }, [updatePostComments]);

  return (
    <div className="_layout _layout_main_wrapper">
      <div className="_layout_mode_swithing_btn">
        <button type="button" className="_layout_swithing_btn_link">
          <div className="_layout_swithing_btn">
            <div className="_layout_swithing_btn_round"></div>
          </div>
          <div className="_layout_change_btn_ic1">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
              <path fill="#fff" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1z"/>
            </svg>
          </div>
          <div className="_layout_change_btn_ic2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)"/>
              <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05"/>
            </svg>
          </div>
        </button>
      </div>

      <div className="_main_layout">
        <Navbar />

        <section
          className="_feed_section"
          style={{
            paddingTop: 80,
            height: "100vh",
            overflowY: "auto",
            paddingBottom: 40,
          }}
        >
          <div className="container _custom_container">
            <div className="row">
              <div className="col-xl-3 col-lg-3 d-none d-lg-block">
                <div className="_feed_left_sidebar _b_radious6">
                  <div className="_feed_left_sidebar_content _padd24">
                    <div className="_feed_left_sidebar_link mb-3">
                      <a href="#" className="_feed_left_sidebar_link_text _active">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21" style={{ marginRight: 8 }}>
                          <path stroke="currentColor" strokeWidth="1.5" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" />
                        </svg>
                        News Feed
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_feed_inner">
                  <CreatePost onSubmit={handleCreatePost} />

                  {loading && posts.length === 0 && (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onDelete={removePost}
                      onLikeToggle={handleLikeToggle}
                      onCommentAdded={handleCommentAdded}
                    />
                  ))}

                  {!loading && posts.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      No posts yet. Be the first to post!
                    </div>
                  )}
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 d-none d-lg-block">
                <div className="_feed_right_sidebar _b_radious6">
                  <div className="_feed_right_sidebar_content _padd24">
                    <h4 className="_feed_right_sidebar_title">Friend Requests</h4>
                    <p className="text-muted" style={{ fontSize: 13 }}>Coming soon...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <FeedContent />
    </ProtectedRoute>
  );
}
