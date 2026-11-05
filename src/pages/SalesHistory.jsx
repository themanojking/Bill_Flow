import React, { useState } from "react";
import { useAuth } from "../authentication/AuthContext";
import { useNavigate } from "react-router-dom";

const SalesHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const sampleBills = [
    {
      id: "INV-2026-0042",
      customer: "Ramesh Kumar",
      items: 3,
      amount: 1499,
      mode: "UPI",
      time: "Today, 11:45 AM",
      status: "Paid",
    },
    {
      id: "INV-2026-0041",
      customer: "Walk-in Customer",
      items: 1,
      amount: 450,
      mode: "Cash",
      time: "Today, 10:15 AM",
      status: "Paid",
    },
    {
      id: "INV-2026-0040",
      customer: "Priya Sharma",
      items: 2,
      amount: 2298,
      mode: "Card",
      time: "Yesterday, 07:20 PM",
      status: "Paid",
    },
    {
      id: "INV-2026-0039",
      customer: "Anand Subramanian",
      items: 4,
      amount: 3200,
      mode: "UPI",
      time: "Yesterday, 04:10 PM",
      status: "Paid",
    },
  ];

  const filteredBills =
    filter === "all"
      ? sampleBills
      : sampleBills.filter((b) => b.mode.toLowerCase() === filter.toLowerCase());

  return (
    <div className="page-container sales-history-page">
      <div className="page-header-row">
        <div>
          <span className="page-tag">PAST BILLS</span>
          <h2>Sales History</h2>
          <p className="page-subtext">Recent invoice records • {user?.shopName || "Store"}</p>
        </div>
        <button className="primary-btn-sm" onClick={() => navigate("/new-bill")}>
          + New Bill
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-chips-row">
        {["all", "upi", "cash", "card"].map((tab) => (
          <button
            key={tab}
            className={`filter-chip ${filter === tab ? "active" : ""}`}
            onClick={() => setFilter(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bills list */}
      <div className="bills-list">
        {filteredBills.map((bill) => (
          <div key={bill.id} className="bill-card">
            <div className="bill-card-top">
              <div>
                <strong className="bill-id">{bill.id}</strong>
                <p className="bill-customer">{bill.customer}</p>
              </div>
              <span className={`payment-pill ${bill.mode.toLowerCase()}`}>
                {bill.mode}
              </span>
            </div>

            <div className="bill-card-bottom">
              <div className="bill-meta">
                <span>{bill.items} items</span> • <span>{bill.time}</span>
              </div>
              <div className="bill-amount">₹{bill.amount.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesHistory;

