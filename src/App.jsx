
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
import "./App.css";

const PlaceholderPage = ({ title }) => (
  <div className="content-card">
    <h2>{title}</h2>
    <p>This section will be developed in the next stages.</p>
  </div>
);

const NewBill = () => (
  <div className="content-card">
    <h2>Create New Bill</h2>
    <BarcodeScanner />
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
          <Route path="/total-sales" element={<PlaceholderPage title="Total Sales" />} />
          <Route path="/products" element={<PlaceholderPage title="Products" />} />
          <Route path="/sales-history" element={<PlaceholderPage title="Sales History" />} />
          <Route path="/customers" element={<PlaceholderPage title="Customers" />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
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
