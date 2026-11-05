import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const CartDrawer = ({ onOpenScanner }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    checkout,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      await checkout({
        paymentMethod,
        customerName: customerName || "Walk-in Customer",
        customerPhone,
      });
      setCustomerName("");
      setCustomerPhone("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanMore = () => {
    setIsCartOpen(false);
    if (onOpenScanner) onOpenScanner();
  };

  return (
    <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}>
      <div
        className="cart-drawer-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title-wrap">
            <span className="cart-tag">BILLING BASKET</span>
            <div className="cart-heading-row">
              <h3 id="cart-title">Cart Items</h3>
              <span className="cart-counter-chip">{cartCount} items</span>
            </div>
          </div>
          <button
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Cart Body */}
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🛒</div>
              <h4>Your Cart is Empty</h4>
              <p>Scan product barcodes to add items and compute totals automatically.</p>
              <button className="primary-btn" onClick={handleScanMore}>
                ⚡ Start Barcode Scan
              </button>
            </div>
          ) : (
            <>
              {/* Quick Actions Bar */}
              <div className="cart-actions-bar">
                <button className="cart-scan-more-btn" onClick={handleScanMore}>
                  ⚡ + Scan More Items
                </button>
                <button className="cart-clear-btn" onClick={clearCart}>
                  Clear All
                </button>
              </div>

              {/* Items List */}
              <div className="cart-items-list">
                {cart.map((item) => {
                  const itemSubtotal = item.price * item.quantity;
                  return (
                    <div key={item.barcode} className="cart-item-card">
                      <div className="cart-item-thumb">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} />
                        ) : (
                          <span>📦</span>
                        )}
                      </div>

                      <div className="cart-item-details">
                        <div className="cart-item-head">
                          <h4 title={item.productName}>{item.productName}</h4>
                          <button
                            className="cart-remove-item-btn"
                            onClick={() => removeFromCart(item.barcode)}
                            title="Remove item"
                            aria-label={`Remove ${item.productName}`}
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="cart-item-submeta">
                          <span className="item-unit-price">
                            ₹{item.price.toFixed(2)} each
                          </span>
                          <span className="item-barcode-chip">
                            #{item.barcode}
                          </span>
                        </div>

                        {/* Quantity Controls & Subtotal */}
                        <div className="cart-item-controls-row">
                          <div className="qty-controls">
                            <button
                              className="qty-btn minus"
                              onClick={() => updateQuantity(item.barcode, -1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button
                              className="qty-btn plus"
                              onClick={() => updateQuantity(item.barcode, 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <div className="cart-item-subtotal">
                            <small>Subtotal</small>
                            <strong>₹{itemSubtotal.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Details Form (Optional) */}
              <div className="cart-customer-section">
                <label className="customer-label">Customer Details (Optional)</label>
                <div className="customer-input-row">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="cart-payment-methods">
                <label className="payment-label">Select Payment Mode</label>
                <div className="payment-options-grid">
                  {[
                    { id: "Cash", icon: "💵", label: "Cash" },
                    { id: "UPI", icon: "📱", label: "UPI / QR" },
                    { id: "Card", icon: "💳", label: "Card / POS" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      className={`payment-option-pill ${
                        paymentMethod === mode.id ? "active" : ""
                      }`}
                      onClick={() => setPaymentMethod(mode.id)}
                    >
                      <span>{mode.icon}</span>
                      <strong>{mode.label}</strong>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Totals Summary */}
              <div className="cart-summary-box">
                <div className="summary-row">
                  <span>Items Count</span>
                  <strong>{cartCount} items</strong>
                </div>
                <div className="summary-row">
                  <span>Subtotal Amount</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Taxes & GST</span>
                  <span className="tax-free-tag">Included</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <div>
                    <strong className="grand-total-label">Grand Total</strong>
                    <small>Payment via {paymentMethod}</small>
                  </div>
                  <strong className="grand-total-amount">
                    ₹{cartTotal.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                className="checkout-primary-btn"
                onClick={handleCheckoutSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span>Saving Sale...</span>
                ) : (
                  <span>
                    ✓ Complete Checkout • ₹{cartTotal.toFixed(2)}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

