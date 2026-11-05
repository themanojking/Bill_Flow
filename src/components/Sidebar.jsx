
import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "▦" },
  { name: "New Bill", path: "/new-bill", icon: "＋" },
  { name: "Total Sales", path: "/total-sales", icon: "₹" },
  { name: "Products", path: "/products", icon: "▣" },
  { name: "Sales History", path: "/sales-history", icon: "◷" },
  { name: "Customers", path: "/customers", icon: "♙" },
  { name: "Reports", path: "/reports", icon: "▥" },
  { name: "Settings", path: "/settings", icon: "⚙" },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="assets/bill-flow-logo.png" alt="Bill Flow" />
        <span>Bill Flow</span>
      </div>

      <p className="menu-label">MAIN MENU</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-logo-small">BF</div>
        <div>
          <strong>Bill Flow</strong>
          <small>Billing Management</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
