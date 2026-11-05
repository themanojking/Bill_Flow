import React from "react";

const LoadingScreen = ({ message = "Loading Bill Flow..." }) => {
  return (
    <div className="splash-loading-container" role="status" aria-live="polite">
      <div className="splash-card">
        {/* Animated App Icon Stage */}
        <div className="splash-icon-stage">
          {/* Pulsing Aura Rings */}
          <div className="splash-aura-ring ring-1"></div>
          <div className="splash-aura-ring ring-2"></div>

          {/* Floating/Bouncing Micro App Badges */}
          <div className="splash-mini-badge badge-receipt" title="Invoices">
            <span>🧾</span>
          </div>
          <div className="splash-mini-badge badge-scan" title="Barcode Scanner">
            <span>▦</span>
          </div>
          <div className="splash-mini-badge badge-rupee" title="Payments">
            <span>₹</span>
          </div>

          {/* Main Bouncing App Icon */}
          <div className="splash-logo-bouncing-box">
            <div className="splash-logo-circle">
              <img
                src="/assets/bill-flow-logo.png"
                alt="Bill Flow Logo"
                className="splash-logo-img"
              />
            </div>
          </div>

          {/* Dynamic Floor Shadow beneath bouncing logo */}
          <div className="splash-floor-shadow"></div>
        </div>

        {/* Brand Information */}
        <div className="splash-text-wrap">
          <h1 className="splash-brand-title">Bill Flow</h1>
          <p className="splash-tagline">Simple. Smart. Billing.</p>

          <div className="splash-status-row">
            <span className="splash-status-text">{message}</span>
            <div className="splash-bouncing-dots">
              <span className="dot dot-1"></span>
              <span className="dot dot-2"></span>
              <span className="dot dot-3"></span>
            </div>
          </div>
        </div>

        {/* Indeterminate Shimmer Progress Bar */}
        <div className="splash-progress-track">
          <div className="splash-progress-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

