
import React from "react";
import { useAuth } from "../authentication/AuthContext";
import { useNavigate, useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const openScanner = outletContext?.openScanner;

  return (
    <div className="dashboard-page">
      <div className="welcome-block">
        <span className="welcome-label">WELCOME BACK 👋</span>
        <h2>{user?.ownerName || "Shop Owner"}</h2>
        <p>{user?.shopName || "Your Shop"}</p>
      </div>

      <section
        className="today-sales-card"
        onClick={() => navigate("/total-sales")}
        style={{ cursor: "pointer" }}
        title="View Today's Detailed Sales"
      >
        <div className="sales-card-top">
          <div>
            <span>YOUR BUSINESS OVERVIEW</span>
            <h3>Today's Sales</h3>
          </div>
          <div className="sales-card-icon">₹</div>
        </div>

        <h2>₹0.00</h2>
        <p>Sales collected today</p>
      </section>

      <section className="quick-action-section">
        <div className="section-heading">
          <h3>Quick Action</h3>
          <span>Start billing</span>
        </div>

        <button
          className="scan-product-card"
          onClick={() => {
            if (openScanner) {
              openScanner();
            } else {
              navigate("/new-bill");
            }
          }}
        >
          <div className="scan-product-icon">▦</div>
          <div className="scan-product-text">
            <h3>Scan Product</h3>
            <p>Open camera scanner to add a product to your bill.</p>
          </div>
          <span className="scan-product-arrow">›</span>
        </button>
      </section>

      <section className="dashboard-info">
        <h3>Welcome to Bill Flow</h3>
        <p>
          Manage your shop billing, scan products and track your daily sales
          from one simple application.
        </p>
      </section>
    </div>
  );
};

export default Dashboard;
