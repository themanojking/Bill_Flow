import React from "react";
import { useCart } from "../context/CartContext";

const ReceiptModal = () => {
  const { lastReceipt, setLastReceipt } = useCart();

  if (!lastReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setLastReceipt(null);
  };

  return (
    <div className="receipt-backdrop" onClick={handleClose}>
      <div
        className="receipt-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="receipt-success-circle">
          <span>✓</span>
        </div>

        <h3 className="receipt-title">Payment Successful!</h3>
        <p className="receipt-subtitle">Total amount added to today's sales</p>

        <div className="receipt-paper">
          <div className="receipt-paper-header">
            <h4>BILL FLOW RETAIL</h4>
            <span className="receipt-invoice-chip">
              #{lastReceipt.invoiceNumber}
            </span>
            <small>
              {new Date(lastReceipt.date).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </small>
          </div>

          <div className="receipt-divider-dashed"></div>

          <div className="receipt-customer-row">
            <span>Customer:</span>
            <strong>{lastReceipt.customerName}</strong>
          </div>
          <div className="receipt-customer-row">
            <span>Payment Mode:</span>
            <span className="payment-badge">{lastReceipt.paymentMethod}</span>
          </div>

          <div className="receipt-divider-dashed"></div>

          {/* Items breakdown */}
          <div className="receipt-items-table">
            <div className="receipt-table-header">
              <span>Item</span>
              <span>Qty</span>
              <span>Price</span>
            </div>
            {lastReceipt.items?.map((item, idx) => (
              <div key={idx} className="receipt-table-row">
                <span className="item-name">{item.productName}</span>
                <span className="item-qty">x{item.quantity}</span>
                <span className="item-sub">₹{item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="receipt-divider-dashed"></div>

          <div className="receipt-total-row">
            <strong>TOTAL PAID</strong>
            <strong className="receipt-final-amount">
              ₹{Number(lastReceipt.totalAmount).toFixed(2)}
            </strong>
          </div>
        </div>

        <div className="receipt-actions">
          <button className="receipt-print-btn" onClick={handlePrint}>
            🖨️ Print Receipt
          </button>
          <button className="receipt-done-btn" onClick={handleClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;

