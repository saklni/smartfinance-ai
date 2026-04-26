// src/pages/public/login.jsx
import { useState, useEffect } from "react";
import "../../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync theme from localStorage (if landing page set it)
  useEffect(() => {
    const saved = localStorage.getItem("sf-theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email address.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    // Simulate API call — replace with real auth logic
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    // Demo: always shows error so you can see the UI
    setError("Invalid email or password. Please try again.");
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
        <h1 className="auth-title">Log in</h1>

        <hr className="auth-divider" />

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="form-field">
            <div className="field-header">
              <label className="field-label" htmlFor="login-email">
                Email address
              </label>
            </div>
            <input
              id="login-email"
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
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* Eye-slash icon */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
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
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="login-password"
              className="field-input"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
            <a className="forgot-link" href="/forgot-password">
              Forget your password
            </a>
          </div>

          {/* Submit */}
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        {/* Footer — sign up */}
        <div className="auth-footer">
          <hr />
          <p className="auth-footer-text">Don't have an account?</p>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => (window.location.href = "/register")}
          >
            Sign up
          </button>
        </div>

      </div>
    </div>
  );
}