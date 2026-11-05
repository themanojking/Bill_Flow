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

  const [showPassword, setShowPassword] = useState(false);
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
      setSuccess("Store account registered successfully! Redirecting to login...");

      setTimeout(() => {
        onLogin();
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow-orb orb-1"></div>
      <div className="auth-glow-orb orb-2"></div>

      <div className="auth-card register-card">
        {/* Brand Header with Animated Logo & Transitions */}
        <div className="auth-brand-head">
          <div className="auth-logo-wrapper">
            <div className="auth-logo-halo"></div>
            <div className="auth-logo-badge">
              <img src="/assets/bill-flow-logo.png" alt="Bill Flow" />
            </div>
          </div>
          <h1>Bill Flow</h1>
          <div className="auth-tagline-badge">
            <span className="badge-dot"></span>
            <span>Smart Billing • Retail POS</span>
          </div>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h2>Create Account</h2>
          <p>Register your store to start barcode billing in minutes</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="auth-error-alert" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-success-alert" role="status">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Owner Name */}
          <div className="form-group">
            <label htmlFor="ownerName">Owner Name</label>
            <div className="input-box-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                id="ownerName"
                name="ownerName"
                placeholder="e.g. Manojkumar"
                value={form.ownerName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Shop Name */}
          <div className="form-group">
            <label htmlFor="shopName">Shop Name</label>
            <div className="input-box-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </span>
              <input
                id="shopName"
                name="shopName"
                placeholder="e.g. Kudanthai Trends"
                value={form.shopName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-box-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="e.g. store@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <div className="input-box-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <input
                id="mobile"
                type="tel"
                name="mobile"
                placeholder="e.g. 9876543210"
                value={form.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="reg-password">Password</label>
              <span className="input-hint">Min 8 characters</span>
            </div>
            <div className="input-box-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                minLength={8}
                required
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading-flex">
                <span className="auth-btn-spinner"></span>
                <span>Creating Account...</span>
              </span>
            ) : (
              <span>Create Store Account →</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer-switch">
          <span>Already have an account?</span>
          <button type="button" className="switch-link-btn" onClick={onLogin}>
            Sign In
          </button>
        </div>

        {/* Security Trust Badge */}
        <div className="auth-security-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Fast, Safe & Secure Cloud POS</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
