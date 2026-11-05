import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import { useCart } from "../context/CartContext";

const TotalSales = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const openScanner = outletContext?.openScanner;

  const {
    todayTotalSales,
    todayBillsCount,
    todayItemsCount,
    todaySalesList,
    setLastReceipt,
  } = useCart();

  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const avgTicket =
    todayBillsCount > 0 ? (todayTotalSales / todayBillsCount).toFixed(2) : "0.00";

  // Calculate payment method breakdowns
  const cashSales = todaySalesList.filter((s) => s.paymentMethod === "Cash");
  const upiSales = todaySalesList.filter((s) => s.paymentMethod === "UPI");
  const cardSales = todaySalesList.filter((s) => s.paymentMethod === "Card");

  const cashTotal = cashSales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
  const upiTotal = upiSales.reduce((sum, s) => sum + Number(s.totalAmount), 0);
  const cardTotal = cardSales.reduce((sum, s) => sum + Number(s.totalAmount), 0);

  const cashPercent =
    todayTotalSales > 0 ? Math.round((cashTotal / todayTotalSales) * 100) : 0;
  const upiPercent =
    todayTotalSales > 0 ? Math.round((upiTotal / todayTotalSales) * 100) : 0;
  const cardPercent =
    todayTotalSales > 0 ? Math.round((cardTotal / todayTotalSales) * 100) : 0;

  return (
    <div className="page-container total-sales-page">
      <div className="page-header-row">
        <div>
          <span className="page-tag">DAILY REVENUE</span>
          <h2>Today's Sales</h2>
          <p className="page-subtext">
            {todayDate} • {user?.shopName || "Store"}
          </p>
        </div>
      </div>

      {/* Main Highlights Card */}
      <section className="sales-hero-card">
        <div className="hero-top">
          <div className="hero-label-wrap">
            <span>GROSS COLLECTION</span>
            <h3>Total Amount</h3>
          </div>
          <div className="hero-status-pill">● Live POS</div>
        </div>

        <div className="hero-amount-wrap">
          <span className="hero-rupee">₹</span>
          <span className="hero-digits">{todayTotalSales.toFixed(2)}</span>
        </div>
        <p className="hero-caption">
          {todayBillsCount} bill{todayBillsCount === 1 ? "" : "s"} collected today
        </p>
      </section>

      {/* 3 Metric Cards */}
      <section className="sales-metric-grid">
        <div className="metric-box">
          <span className="metric-icon">🧾</span>
          <span className="metric-num">{todayBillsCount}</span>
          <span className="metric-label">Bills Count</span>
        </div>
        <div className="metric-box">
          <span className="metric-icon">📦</span>
          <span className="metric-num">{todayItemsCount}</span>
          <span className="metric-label">Items Sold</span>
        </div>
        <div className="metric-box">
          <span className="metric-icon">🎯</span>
          <span className="metric-num">₹{avgTicket}</span>
          <span className="metric-label">Avg Ticket</span>
        </div>
      </section>

      {/* Payment Modes Breakdown */}
      <section className="section-card payment-breakdown-card">
        <h3 className="card-heading">Payment Modes Breakdown</h3>
        <div className="payment-modes-list">
          <div className="payment-mode-item">
            <div className="mode-left">
              <span className="mode-badge cash">💵</span>
              <div>
                <strong>Cash Payment</strong>
                <small>{cashSales.length} transactions</small>
              </div>
            </div>
            <div className="mode-right">
              <strong>₹{cashTotal.toFixed(2)}</strong>
              <small>{cashPercent}%</small>
            </div>
          </div>

          <div className="payment-mode-item">
            <div className="mode-left">
              <span className="mode-badge upi">📱</span>
              <div>
                <strong>UPI / QR Code</strong>
                <small>{upiSales.length} transactions</small>
              </div>
            </div>
            <div className="mode-right">
              <strong>₹{upiTotal.toFixed(2)}</strong>
              <small>{upiPercent}%</small>
            </div>
          </div>

          <div className="payment-mode-item">
            <div className="mode-left">
              <span className="mode-badge card">💳</span>
              <div>
                <strong>Debit / Credit Card</strong>
                <small>{cardSales.length} transactions</small>
              </div>
            </div>
            <div className="mode-right">
              <strong>₹{cardTotal.toFixed(2)}</strong>
              <small>{cardPercent}%</small>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Transactions Timeline */}
      <section className="section-card transactions-card">
        <div className="card-header-flex">
          <h3 className="card-heading">Today's Invoices</h3>
          <span className="counter-pill">{todayBillsCount} Records</span>
        </div>

        {todayBillsCount === 0 ? (
          <div className="empty-state-box">
            <div className="empty-icon">🧾</div>
            <h4>No bills generated yet today</h4>
            <p>
              Scan products into cart and complete checkout to see live records!
            </p>
            <button
              className="primary-btn"
              onClick={() => {
                if (openScanner) openScanner();
                else navigate("/new-bill");
              }}
            >
              ⚡ Scan & Bill Products
            </button>
          </div>
        ) : (
          <div className="today-invoices-list">
            {todaySalesList.map((bill) => (
              <div
                key={bill.invoiceNumber || bill.id}
                className="today-invoice-card"
                onClick={() => setLastReceipt(bill)}
                role="button"
                tabIndex={0}
                title="Tap to view full receipt"
              >
                <div className="invoice-card-top">
                  <div>
                    <strong className="invoice-id">
                      #{bill.invoiceNumber || bill.id}
                    </strong>
                    <span className="invoice-customer">
                      {bill.customerName || "Customer"}
                    </span>
                  </div>
                  <span
                    className={`payment-pill ${bill.paymentMethod?.toLowerCase()}`}
                  >
                    {bill.paymentMethod}
                  </span>
                </div>

                <div className="invoice-card-bottom">
                  <div className="invoice-meta-info">
                    <span>{bill.itemsCount || bill.items?.length || 1} items</span> •{" "}
                    <span>
                      {bill.formattedTime ||
                        new Date(bill.date).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </div>
                  <strong className="invoice-total">
                    ₹{Number(bill.totalAmount).toFixed(2)}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TotalSales;
