import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Auth.css";

const Login = ({ onRegister }) => {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(identifier, password);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please verify your email/mobile and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow-orb orb-1"></div>
      <div className="auth-glow-orb orb-2"></div>

      <div className="auth-card">
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

        {/* Form Title */}
        <div className="auth-heading">
          <h2>Welcome Back</h2>
          <p>Sign in to manage your shop, sales & billing counter</p>
        </div>

        {/* Error Alert */}
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

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email or Mobile Input */}
          <div className="form-group">
            <label htmlFor="identifier">Email or Mobile Number</label>
            <div className="input-box-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                id="identifier"
                type="text"
                placeholder="e.g. 9876543210 or store@gmail.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-box-wrap">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          {/* Submit Button */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading-flex">
                <span className="auth-btn-spinner"></span>
                <span>Signing in...</span>
              </span>
            ) : (
              <span>Sign In to Store →</span>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="auth-footer-switch">
          <span>New to Bill Flow?</span>
          <button type="button" className="switch-link-btn" onClick={onRegister}>
            Create Shop Account
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

export default Login;
