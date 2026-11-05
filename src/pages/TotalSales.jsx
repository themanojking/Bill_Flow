import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

const TotalSales = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="page-container total-sales-page">
      <div className="page-header-row">
        <div>
          <span className="page-tag">DAILY REVENUE</span>
          <h2>Today's Sales</h2>
          <p className="page-subtext">{todayDate} • {user?.shopName || "Store"}</p>
        </div>
      </div>

      {/* Main Highlights Card */}
      <section className="sales-hero-card">
        <div className="hero-top">
          <div className="hero-label-wrap">
            <span>GROSS COLLECTION</span>
            <h3>Total Amount</h3>
          </div>
          <div className="hero-status-pill">● Live</div>
        </div>

        <div className="hero-amount-wrap">
          <span className="hero-rupee">₹</span>
          <span className="hero-digits">0.00</span>
        </div>
        <p className="hero-caption">0 bills generated today</p>
      </section>

      {/* 3 Metric Cards */}
      <section className="sales-metric-grid">
        <div className="metric-box">
          <span className="metric-icon">🧾</span>
          <span className="metric-num">0</span>
          <span className="metric-label">Bills Count</span>
        </div>
        <div className="metric-box">
          <span className="metric-icon">📦</span>
          <span className="metric-num">0</span>
          <span className="metric-label">Items Sold</span>
        </div>
        <div className="metric-box">
          <span className="metric-icon">🎯</span>
          <span className="metric-num">₹0</span>
          <span className="metric-label">Avg Ticket</span>
        </div>
      </section>

      {/* Payment Modes Breakdown */}
      <section className="section-card payment-breakdown-card">
        <h3 className="card-heading">Payment Modes</h3>
        <div className="payment-modes-list">
          <div className="payment-mode-item">
            <div className="mode-left">
              <span className="mode-badge cash">💵</span>
              <div>
                <strong>Cash Payment</strong>
                <small>0 transactions</small>
              </div>
            </div>
            <div className="mode-right">
              <strong>₹0.00</strong>
              <small>0%</small>
            </div>
          </div>

          <div className="payment-mode-item">
            <div className="mode-left">
              <span className="mode-badge upi">📱</span>
              <div>
                <strong>UPI / QR Code</strong>
                <small>0 transactions</small>
              </div>
            </div>
            <div className="mode-right">
              <strong>₹0.00</strong>
              <small>0%</small>
            </div>
          </div>

          <div className="payment-mode-item">
            <div className="mode-left">
              <span className="mode-badge card">💳</span>
              <div>
                <strong>Debit / Credit Card</strong>
                <small>0 transactions</small>
              </div>
            </div>
            <div className="mode-right">
              <strong>₹0.00</strong>
              <small>0%</small>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Transactions Timeline */}
      <section className="section-card transactions-card">
        <div className="card-header-flex">
          <h3 className="card-heading">Today's Invoices</h3>
          <span className="counter-pill">0 Records</span>
        </div>

        <div className="empty-state-box">
          <div className="empty-icon">🧾</div>
          <h4>No bills generated yet today</h4>
          <p>Scan products and start billing customers to see live transaction history.</p>
          <button
            className="primary-btn"
            onClick={() => navigate("/new-bill")}
          >
            ⚡ Create New Bill
          </button>
        </div>
      </section>
    </div>
  );
};

export default TotalSales;

