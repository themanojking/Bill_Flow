import React from "react";
import { useAuth } from "../authentication/AuthContext";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const openScanner = outletContext?.openScanner;
  const { todayTotalSales, todayBillsCount, cartCount, cartTotal, setIsCartOpen } = useCart();

  return (
    <div className="dashboard-page">
      <div className="welcome-block">
        <span className="welcome-label">WELCOME BACK 👋</span>
        <h2>{user?.ownerName || "Shop Owner"}</h2>
        <p>{user?.shopName || "Your Shop"}</p>
      </div>

      {/* Active Cart Banner (Appears when items are scanned) */}
      {cartCount > 0 && (
        <div
          className="active-cart-banner"
          onClick={() => setIsCartOpen(true)}
          role="button"
          tabIndex={0}
        >
          <div className="active-cart-left">
            <span className="active-cart-icon">🛒</span>
            <div>
              <strong>Active Basket: {cartCount} items</strong>
              <small>Tap to adjust quantities & checkout</small>
            </div>
          </div>
          <div className="active-cart-right">
            <span className="active-cart-total">₹{cartTotal.toFixed(2)}</span>
            <span className="active-cart-arrow">→</span>
          </div>
        </div>
      )}

      {/* Today's Sales Card with live update from checkout */}
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

        <h2>₹{todayTotalSales.toFixed(2)}</h2>
        <p>{todayBillsCount} bill{todayBillsCount === 1 ? "" : "s"} collected today</p>
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
