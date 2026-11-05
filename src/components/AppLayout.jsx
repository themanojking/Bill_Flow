import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CameraScannerModal from "./CameraScannerModal";

const AppLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="mobile-app">
      <Header onMenuClick={() => setMenuOpen(true)} />

      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenScanner={() => setScannerOpen(true)}
      />

      {/* Live Camera Scanner Modal - opens camera directly without navigating away */}
      <CameraScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />

      <main className="mobile-content">
        <Outlet context={{ openScanner: () => setScannerOpen(true) }} />
      </main>

      <nav className="bottom-navigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`
          }
        >
          <span className="bottom-nav-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </span>
          <span>Dashboard</span>
        </NavLink>

        {/* Scan Button: Directly triggers camera scanner without page navigation */}
        <button
          type="button"
          className={`bottom-nav-item scan-nav-button ${scannerOpen ? "scan-nav-active" : ""}`}
          onClick={() => setScannerOpen(true)}
          aria-label="Open Camera Barcode Scanner"
        >
          <span className="scan-nav-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </span>
          <span>Scan</span>
        </button>

        <NavLink
          to="/total-sales"
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "bottom-nav-active" : ""}`
          }
        >
          <span className="bottom-nav-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </span>
          <span>Sales</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AppLayout;
