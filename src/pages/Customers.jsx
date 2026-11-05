import React, { useState } from "react";
import { useAuth } from "../authentication/AuthContext";

const Customers = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Ramesh Kumar",
      phone: "+91 98401 23456",
      visits: 12,
      totalSpent: 4520,
      lastVisit: "Today",
    },
    {
      id: 2,
      name: "Priya Sharma",
      phone: "+91 97890 65432",
      visits: 6,
      totalSpent: 2180,
      lastVisit: "Yesterday",
    },
    {
      id: 3,
      name: "Anand Subramanian",
      phone: "+91 94441 98765",
      visits: 9,
      totalSpent: 3890,
      lastVisit: "3 days ago",
    },
    {
      id: 4,
      name: "Lakshmi Narayanan",
      phone: "+91 99620 44321",
      visits: 4,
      totalSpent: 1450,
      lastVisit: "1 week ago",
    },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
  });

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    setCustomers([
      {
        id: Date.now(),
        name: newCustomer.name,
        phone: newCustomer.phone,
        visits: 1,
        totalSpent: 0,
        lastVisit: "Just now",
      },
      ...customers,
    ]);

    setNewCustomer({ name: "", phone: "" });
    setShowAddModal(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="page-container customers-page">
      <div className="page-header-row">
        <div>
          <span className="page-tag">CRM & LOYALTY</span>
          <h2>Customers</h2>
          <p className="page-subtext">{customers.length} registered customers at {user?.shopName || "store"}</p>
        </div>
        <button
          className="add-customer-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add
        </button>
      </div>

      {/* Search Input */}
      <div className="search-box-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search by customer name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-search-btn" onClick={() => setSearch("")}>
            ✕
          </button>
        )}
      </div>

      {/* Customer List */}
      <div className="customers-list">
        {filteredCustomers.map((cust) => (
          <div key={cust.id} className="customer-card">
            <div className="cust-card-top">
              <div className="cust-avatar">
                {cust.name.charAt(0).toUpperCase()}
              </div>
              <div className="cust-info">
                <h4>{cust.name}</h4>
                <p className="cust-phone">{cust.phone}</p>
              </div>
              <span className="cust-visits-badge">{cust.visits} bills</span>
            </div>

            <div className="cust-card-bottom">
              <div>
                <small>Total Spent</small>
                <strong>₹{cust.totalSpent.toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <small>Last Visit</small>
                <span>{cust.lastVisit}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="empty-search-box">
            <p>No customers found matching "{search}"</p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddCustomer} className="modal-form">
              <label>Customer Name</label>
              <input
                required
                placeholder="e.g. Karthik Raja"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />

              <label>Mobile Number</label>
              <input
                required
                type="tel"
                placeholder="e.g. +91 98400 11223"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;

