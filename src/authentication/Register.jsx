
import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Auth.css";

const Register = ({ onLogin }) => {
  const { register } = useAuth();

  const [form, setForm] = useState({
    ownerName: "",
    shopName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await register(form);

      setSuccess("Account created successfully! Please login.");

      setTimeout(() => {
        onLogin();
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-logo">
          <img src="assets/bill-flow-logo.png" alt="Bill Flow" />
          <h1>Bill Flow</h1>
          <p>Start managing your shop today.</p>
        </div>

        <div className="auth-heading">
          <h2>Create Account</h2>
          <p>Enter your shop details to get started.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label>Owner Name</label>
          <input
            name="ownerName"
            placeholder="Enter owner name"
            value={form.ownerName}
            onChange={handleChange}
            required
          />

          <label>Shop Name</label>
          <input
            name="shopName"
            placeholder="Enter shop name"
            value={form.shopName}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            placeholder="Enter mobile number"
            value={form.mobile}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <button onClick={onLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
