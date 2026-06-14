"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
      <div className="container _custom_container">
        <div className="_logo_wrap">
          <a className="navbar-brand" href="/feed">
            <img src="/assets/images/logo.svg" alt="Image" className="_nav_logo" />
          </a>
        </div>
        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="_header_form ms-auto">
            <form className="_header_form_grp">
              <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                <circle cx="7" cy="7" r="6" stroke="#666" />
                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
              </svg>
              <input className="form-control me-2 _inpt1" type="search" placeholder="input search text" />
            </form>
          </div>
          <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
            <li className="nav-item _header_nav_item">
              <a className="nav-link _header_nav_link_active _header_nav_link" href="/feed">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
                  <path className="_home_active" stroke="#000" strokeWidth="1.5" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                  <path className="_home_active" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" />
                </svg>
              </a>
            </li>
          </ul>

          <div className="dropdown" style={{ position: "relative" }}>
            <button
              className="nav-link _header_nav_link dropdown-toggle d-flex align-items-center"
              style={{ background: "none", border: "none" }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user?.avatarUrl || "/assets/images/post_img.png"}
                alt=""
                style={{ width: 36, height: 36, borderRadius: "50%", marginRight: 8 }}
              />
              <span style={{ fontSize: 14, color: "#333" }}>{user?.firstName}</span>
            </button>
            {showDropdown && (
              <div
                className="dropdown-menu show"
                style={{ position: "absolute", right: 0, top: "100%", minWidth: 150 }}
              >
                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
