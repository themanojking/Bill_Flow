import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

const Sidebar = ({ isOpen, onClose, onOpenScanner }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login");
  };

  const handleScanAction = () => {
    onClose();
    if (onOpenScanner) {
      onOpenScanner();
    } else {
      navigate("/new-bill");
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      {isOpen && (
        <div
          className="drawer-overlay"
          onClick={onClose}
          aria-label="Close menu backdrop"
        />
      )}

      <aside
        className={`mobile-drawer ${isOpen ? "drawer-open" : ""}`}
        aria-hidden={!isOpen}
      >
        {/* Top Header */}
        <div className="drawer-header">
          <div className="drawer-header-brand">
            <img src="/assets/bill-flow-logo.png" alt="Bill Flow" />
            <div>
              <h3>Bill Flow</h3>
              <span>Store Control Menu</span>
            </div>
          </div>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="drawer-scroll-body">
          {/* User & Shop Details Card */}
          <div className="drawer-profile-card">
            <div className="profile-card-top">
              <div className="profile-card-avatar">
                {(user?.ownerName || "U").charAt(0).toUpperCase()}
                <span className="avatar-online-dot" title="Active"></span>
              </div>
              <div className="profile-card-info">
                <div className="profile-name-row">
                  <h4 className="profile-owner-name">
                    {user?.ownerName || "Shop Owner"}
                  </h4>
                  <span className="profile-badge">
                    {user?.role === "shopOwner" ? "Owner" : "Manager"}
                  </span>
                </div>
                <div className="profile-shop-tag">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>{user?.shopName || "Kudanthai Trends"}</span>
                </div>
              </div>
            </div>

            {/* Contact details row */}
            <div className="profile-contact-list">
              <div className="contact-item">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>{user?.mobile ? `+91 ${user.mobile}` : "+91 98765 43210"}</span>
              </div>
              <div className="contact-item">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span className="contact-email">
                  {user?.email || "owner@billflow.in"}
                </span>
              </div>
            </div>

            {/* Quick status bar */}
            <div className="profile-status-bar">
              <div className="status-indicator">
                <span className="status-ping"></span>
                <span>Counter Active</span>
              </div>
              <span className="status-date">{todayFormatted}</span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="drawer-quick-billing">
            <button
              className="quick-bill-cta"
              onClick={handleScanAction}
            >
              <div className="cta-icon">⚡</div>
              <div className="cta-text">
                <strong>Scan Barcode</strong>
                <small>Open camera & scan item</small>
              </div>
              <span className="cta-arrow">→</span>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="drawer-nav">
            <div className="nav-group-label">MAIN MENU</div>

            <NavLink
              to="/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                `drawer-item ${isActive ? "drawer-item-active" : ""}`
              }
            >
              <span className="drawer-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </span>
              <span className="drawer-label">Dashboard</span>
              <span className="drawer-arrow">›</span>
            </NavLink>

            <NavLink
              to="/new-bill"
              onClick={onClose}
              className={({ isActive }) =>
                `drawer-item ${isActive ? "drawer-item-active" : ""}`
              }
            >
              <span className="drawer-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </span>
              <span className="drawer-label">New Bill & Scan</span>
              <span className="drawer-badge badge-blue">Quick</span>
              <span className="drawer-arrow">›</span>
            </NavLink>

            <NavLink
              to="/total-sales"
              onClick={onClose}
              className={({ isActive }) =>
                `drawer-item ${isActive ? "drawer-item-active" : ""}`
              }
            >
              <span className="drawer-icon">
                <span className="rupee-icon">₹</span>
              </span>
              <span className="drawer-label">Today's Sales</span>
              <span className="drawer-badge badge-green">Live</span>
              <span className="drawer-arrow">›</span>
            </NavLink>

            <div className="nav-group-label">STORE MANAGEMENT</div>

            <NavLink
              to="/products"
              onClick={onClose}
              className={({ isActive }) =>
                `drawer-item ${isActive ? "drawer-item-active" : ""}`
              }
            >
              <span className="drawer-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </span>
              <span className="drawer-label">Products & Stock</span>
              <span className="drawer-arrow">›</span>
            </NavLink>

            <NavLink
              to="/sales-history"
              onClick={onClose}
              className={({ isActive }) =>
                `drawer-item ${isActive ? "drawer-item-active" : ""}`
              }
            >
              <span className="drawer-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <span className="drawer-label">Sales History</span>
              <span className="drawer-arrow">›</span>
            </NavLink>

            <NavLink
              to="/customers"
              onClick={onClose}
              className={({ isActive }) =>
                `drawer-item ${isActive ? "drawer-item-active" : ""}`
              }
            >
              <span className="drawer-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <span className="drawer-label">Customers</span>
              <span className="drawer-arrow">›</span>
            </NavLink>

            <NavLink
              to="/reports"
              onClick={onClose}
              className={({ isActive }) =>
                `drawer-item ${isActive ? "drawer-item-active" : ""}`
              }
            >
              <span className="drawer-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </span>
              <span className="drawer-label">Reports & Analytics</span>
              <span className="drawer-arrow">›</span>
            </NavLink>

            <div className="nav-group-label">PREFERENCES</div>

            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `drawer-item ${isActive ? "drawer-item-active" : ""}`
              }
            >
              <span className="drawer-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </span>
              <span className="drawer-label">Store Settings</span>
              <span className="drawer-arrow">›</span>
            </NavLink>
          </nav>

          {/* Sign Out Card */}
          <div className="drawer-signout-wrap">
            <button
              className="drawer-signout-btn"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Sign Out ({user?.ownerName ? user.ownerName.split(" ")[0] : "Account"})</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <div className="footer-brand">
            <strong>Bill Flow POS</strong>
            <span>v1.2.0</span>
          </div>
          <small>Simple. Smart. Billing for {user?.shopName || "Retail"}</small>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
