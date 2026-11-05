import React, { useState } from "react";
import { useAuth } from "../authentication/AuthContext";

const Reports = () => {
  const { user } = useAuth();
  const [range, setRange] = useState("week");

  return (
    <div className="page-container reports-page">
      <div className="page-header-row">
        <div>
          <span className="page-tag">ANALYTICS</span>
          <h2>Reports & Insights</h2>
          <p className="page-subtext">Business performance for {user?.shopName || "Store"}</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="filter-chips-row">
        {["today", "week", "month", "year"].map((t) => (
          <button
            key={t}
            className={`filter-chip ${range === t ? "active" : ""}`}
            onClick={() => setRange(t)}
          >
            {t === "today" ? "TODAY" : t === "week" ? "THIS WEEK" : t === "month" ? "THIS MONTH" : "YEAR 2026"}
          </button>
        ))}
      </div>

      {/* Highlights */}
      <div className="reports-highlights-grid">
        <div className="report-stat-card">
          <span>TOTAL REVENUE</span>
          <h3>₹18,450.00</h3>
          <small className="growth positive">↑ +14% vs last period</small>
        </div>

        <div className="report-stat-card">
          <span>TOTAL ORDERS</span>
          <h3>28 Bills</h3>
          <small className="growth positive">↑ +8% conversion</small>
        </div>

        <div className="report-stat-card">
          <span>AVERAGE ORDER</span>
          <h3>₹658.90</h3>
          <small className="neutral">Stable basket size</small>
        </div>

        <div className="report-stat-card">
          <span>REPEAT CUSTOMERS</span>
          <h3>64%</h3>
          <small className="growth positive">High loyalty</small>
        </div>
      </div>

      {/* Top Selling Products */}
      <section className="section-card">
        <h3 className="card-heading">Top Performing Items</h3>
        <div className="top-items-list">
          <div className="top-item-row">
            <span className="item-rank">1</span>
            <div className="item-info">
              <strong>Cotton Casual Shirt</strong>
              <small>18 units sold</small>
            </div>
            <strong className="item-rev">₹14,382</strong>
          </div>

          <div className="top-item-row">
            <span className="item-rank">2</span>
            <div className="item-info">
              <strong>Denim Slim Jeans</strong>
              <small>8 units sold</small>
            </div>
            <strong className="item-rev">₹10,392</strong>
          </div>

          <div className="top-item-row">
            <span className="item-rank">3</span>
            <div className="item-info">
              <strong>Printed Silk Scarf</strong>
              <small>12 units sold</small>
            </div>
            <strong className="item-rev">₹5,400</strong>
          </div>
        </div>
      </section>

      {/* Payment Modes Share */}
      <section className="section-card">
        <h3 className="card-heading">Payment Collection Share</h3>
        <div className="share-bars-wrap">
          <div className="share-row">
            <div className="share-label">
              <span>UPI / QR</span>
              <strong>58% (₹10,701)</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill upi" style={{ width: "58%" }}></div>
            </div>
          </div>

          <div className="share-row">
            <div className="share-label">
              <span>Cash</span>
              <strong>32% (₹5,904)</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill cash" style={{ width: "32%" }}></div>
            </div>
          </div>

          <div className="share-row">
            <div className="share-label">
              <span>Card / POS</span>
              <strong>10% (₹1,845)</strong>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill card" style={{ width: "10%" }}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;

