
import React from "react";
import { useAuth } from "../authentication/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Sales",
      value: "₹0.00",
      description: "Overall sales amount",
      icon: "₹",
    },
    {
      title: "Total Bills",
      value: "0",
      description: "Bills generated",
      icon: "▤",
    },
    {
      title: "Total Products",
      value: "0",
      description: "Available products",
      icon: "▣",
    },
    {
      title: "Total Customers",
      value: "0",
      description: "Registered customers",
      icon: "♙",
    },
  ];

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>Welcome, {user?.ownerName}!</h1>
          <p>Here's what's happening in your shop today.</p>
        </div>

        <button
          className="new-bill-button"
          onClick={() => navigate("/new-bill")}
        >
          + Create New Bill
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-card-top">
              <span>{stat.title}</span>
              <div className="stat-icon">{stat.icon}</div>
            </div>

            <h2>{stat.value}</h2>
            <small>{stat.description}</small>
          </div>
        ))}
      </div>

      <div className="content-card">
        <div className="section-heading">
          <h3>Recent Sales</h3>
          <button onClick={() => navigate("/sales-history")}>
            View All
          </button>
        </div>

        <div className="empty-state">
          <div className="empty-icon">▤</div>
          <h3>No sales yet</h3>
          <p>Your recent billing transactions will appear here.</p>
          <button onClick={() => navigate("/new-bill")}>
            Create Your First Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
