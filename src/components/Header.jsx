
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";

const pageNames = {
  "/dashboard": "Dashboard",
  "/new-bill": "New Bill",
  "/total-sales": "Total Sales",
  "/products": "Products",
  "/sales-history": "Sales History",
  "/customers": "Customers",
  "/reports": "Reports",
  "/settings": "Settings",
};

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{pageNames[location.pathname] || "Dashboard"}</h2>
        <p>Welcome back, {user?.ownerName}</p>
      </div>

      <div className="profile-hover">
        <button className="profile-button" aria-label="User profile">
          {user?.ownerName?.charAt(0).toUpperCase() || "U"}
        </button>

        <div className="profile-dropdown">
          <button onClick={handleLogout}>
            <span>↪</span> Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
