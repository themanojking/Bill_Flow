import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  const handleGoToSettings = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <header className="mobile-header">
      <div className="header-brand" onClick={() => navigate("/dashboard")} role="button" tabIndex={0}>
        <img src="/assets/bill-flow-logo.png" alt="Bill Flow" />
        <div className="header-title-wrap">
          <span className="brand-name">Bill Flow</span>
          {user?.shopName && (
            <span className="header-shop-subtitle" title={user.shopName}>
              {user.shopName}
            </span>
          )}
        </div>
      </div>

      <div className="header-actions">
        {/* User Profile avatar & Dropdown */}
        <div className="profile-wrapper" ref={profileRef}>
          <button
            className={`profile-button ${profileOpen ? "profile-button-active" : ""}`}
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="User profile and store details"
            title={`${user?.ownerName || "Owner"} - ${user?.shopName || "Shop"}`}
          >
            {(user?.ownerName || "U").charAt(0).toUpperCase()}
          </button>

          {profileOpen && (
            <div className="profile-dropdown-card">
              <div className="dropdown-user-header">
                <div className="dropdown-avatar">
                  {(user?.ownerName || "U").charAt(0).toUpperCase()}
                </div>
                <div className="dropdown-user-info">
                  <strong>{user?.ownerName || "Shop Owner"}</strong>
                  <span className="dropdown-role-chip">Owner</span>
                  <small className="dropdown-shop-name">{user?.shopName || "Kudanthai Trends"}</small>
                </div>
              </div>

              <div className="dropdown-contact-rows">
                <div className="dropdown-contact-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>{user?.mobile ? `+91 ${user.mobile}` : "+91 98765 43210"}</span>
                </div>
                <div className="dropdown-contact-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="dropdown-email">{user?.email || "owner@billflow.in"}</span>
                </div>
              </div>

              <div className="dropdown-actions">
                <button
                  className="dropdown-action-btn settings-btn"
                  onClick={handleGoToSettings}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Store Settings</span>
                </button>

                <button
                  className="dropdown-action-btn logout-btn"
                  onClick={handleLogout}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hamburger Menu Toggle Button */}
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Open menu drawer"
          title="Open Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
