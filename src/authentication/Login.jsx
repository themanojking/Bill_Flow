
import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Auth.css";

const Login = ({ onRegister }) => {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
        err.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="assets/bill-flow-logo.png" alt="Bill Flow" />
          <h1>Bill Flow</h1>
          <p>Smart Billing. Simple Business.</p>
        </div>

        <div className="auth-heading">
          <h2>Welcome Back!</h2>
          <p>Login to manage your shop.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email or Mobile Number</label>
          <input
            type="text"
            placeholder="Enter email or mobile number"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <button onClick={onRegister}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
