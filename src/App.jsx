import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "./authentication/AuthContext";
import Login from "./authentication/Login";
import Register from "./authentication/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import BarcodeScanner from "./components/BarcodeScanner";

import Dashboard from "./pages/Dashboard";
import TotalSales from "./pages/TotalSales";
import Products from "./pages/Products";
import SalesHistory from "./pages/SalesHistory";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import "./App.css";

const NewBill = () => (
  <div className="new-bill-page">
    <div className="page-header-row">
      <div>
        <span className="page-tag">SCANNER & POS</span>
        <h2>Create New Bill</h2>
        <p className="page-subtext">Scan product barcodes or enter item codes to bill</p>
      </div>
    </div>
    <div className="scanner-card-wrap">
      <BarcodeScanner />
    </div>
  </div>
);

function App() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading-screen">Loading Bill Flow...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onRegister={() => navigate("/register")} />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register onLogin={() => navigate("/login")} />
          )
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-bill" element={<NewBill />} />
          <Route path="/total-sales" element={<TotalSales />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sales-history" element={<SalesHistory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
