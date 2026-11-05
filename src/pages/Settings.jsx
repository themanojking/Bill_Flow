import React, { useState } from "react";
import { useAuth } from "../authentication/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [roundOff, setRoundOff] = useState(true);
  const [saveNotice, setSaveNotice] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSavePreferences = () => {
    setSaveNotice("Settings saved successfully!");
    setTimeout(() => setSaveNotice(""), 2500);
  };

  return (
    <div className="page-container settings-page">
      <div className="page-header-row">
        <div>
          <span className="page-tag">CONFIGURATION</span>
          <h2>Store Settings</h2>
          <p className="page-subtext">Manage shop info, billing preferences & account</p>
        </div>
      </div>

      {saveNotice && <div className="toast-success">{saveNotice}</div>}

      {/* Shop Profile Details Card */}
      <section className="section-card shop-profile-settings">
        <div className="settings-section-head">
          <div className="settings-icon-wrap">🏢</div>
          <div>
            <h3>Shop & Owner Details</h3>
            <p>Your registered store credentials</p>
          </div>
        </div>

        <div className="settings-details-grid">
          <div className="detail-field">
            <label>Shop Name</label>
            <div className="field-value-box highlight">{user?.shopName || "Kudanthai Trends"}</div>
          </div>

          <div className="detail-field">
            <label>Owner Name</label>
            <div className="field-value-box">{user?.ownerName || "Manojkumar"}</div>
          </div>

          <div className="detail-field">
            <label>Mobile Number</label>
            <div className="field-value-box">
              {user?.mobile ? `+91 ${user.mobile}` : "+91 98765 43210"}
            </div>
          </div>

          <div className="detail-field">
            <label>Email Address</label>
            <div className="field-value-box">{user?.email || "owner@billflow.in"}</div>
          </div>

          <div className="detail-field">
            <label>Store Role</label>
            <div className="field-value-box badge-role">
              {user?.role === "shopOwner" ? "Store Owner (Full Access)" : "Cashier / Staff"}
            </div>
          </div>

          <div className="detail-field">
            <label>Currency & Locale</label>
            <div className="field-value-box">₹ INR (India)</div>
          </div>
        </div>
      </section>

      {/* Billing Preferences */}
      <section className="section-card">
        <div className="settings-section-head">
          <div className="settings-icon-wrap">⚙️</div>
          <div>
            <h3>Billing & POS Preferences</h3>
            <p>Customize barcode scanner and invoices</p>
          </div>
        </div>

        <div className="settings-toggles-list">
          <div className="toggle-row">
            <div>
              <strong>Barcode Scanner Beep Sound</strong>
              <p>Play confirmation audio chime when barcode is detected</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div>
              <strong>Auto Prompt Receipt Print</strong>
              <p>Immediately trigger thermal printer dialog after bill save</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={printReceipt}
                onChange={(e) => setPrintReceipt(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div>
              <strong>Round Off Bill Total</strong>
              <p>Round final bill amount to nearest integer rupee</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={roundOff}
                onChange={(e) => setRoundOff(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <button className="secondary-btn" onClick={handleSavePreferences}>
          Save Preferences
        </button>
      </section>

      {/* Account & App Info */}
      <section className="section-card account-card">
        <div className="settings-section-head">
          <div className="settings-icon-wrap">🛡️</div>
          <div>
            <h3>Session & Security</h3>
            <p>Signed in as {user?.email || "User"}</p>
          </div>
        </div>

        <div className="app-info-row">
          <div>
            <strong>Bill Flow POS System</strong>
            <small>Version 1.2.0 • Production Build</small>
          </div>
          <span className="system-status-chip">● Online</span>
        </div>

        <button className="danger-btn" onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Sign Out from this Device</span>
        </button>
      </section>
    </div>
  );
};

export default Settings;

