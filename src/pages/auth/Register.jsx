// src/pages/public/register.jsx
import { useState, useEffect } from "react";
import "../../styles/auth.css";

const EyeIcon = ({ visible }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {visible ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sf-theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) return setError("Please enter your email address.");
    if (!password) return setError("Please enter a password.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    // Simulate API call — replace with real auth logic
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    setSuccess("Account created! Redirecting to login…");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand-name">
            Smart<span>Finance</span> AI
          </span>
        </div>

        {/* Title */}
        <h1 className="auth-title">Create an Account</h1>

        <hr className="auth-divider" />

        {/* Messages */}
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label" htmlFor="reg-email">
                Email address
              </label>
            </div>
            <input
              id="reg-email"
              className="field-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
          </div>

          {/* Password */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label" htmlFor="reg-password">
                Password
              </label>
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon visible={showPassword} />
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="reg-password"
              className="field-input"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>

          {/* Confirm Password */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label" htmlFor="reg-confirm">
                Confirm Password
              </label>
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                <EyeIcon visible={showConfirm} />
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="reg-confirm"
              className="field-input"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder=""
            />
          </div>

          {/* Submit */}
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        {/* Footer — already have account */}
        <div className="auth-footer">
          <hr />
          <p className="auth-footer-text">I Already Have an Account</p>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => (window.location.href = "/login")}
          >
            Log in
          </button>
        </div>

      </div>
    </div>
  );
}