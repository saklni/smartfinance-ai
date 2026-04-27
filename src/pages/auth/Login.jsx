// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import "../../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

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
    try {
      const user = await login(email, password);

      // Gunakan navigate() bukan window.location.href
      if (user.role === "admin" || user.role_id === 1) {
        navigate("/admin", { replace: true });
      } else if (!user.onboarding_completed) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-name">Smart<span>Finance</span> AI</span>
        </div>

        <h1 className="auth-title">Log in</h1>
        <hr className="auth-divider" />

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <div className="field-header">
              <label className="field-label" htmlFor="login-email">Email address</label>
            </div>
            <input
              id="login-email"
              className="field-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <div className="field-header">
              <label className="field-label" htmlFor="login-password">Password</label>
              <button type="button" className="field-toggle" onClick={() => setShowPassword(v => !v)}>
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
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="auth-footer">
          <hr />
          <p className="auth-footer-text">Don't have an account?</p>
          <button className="btn-secondary" type="button" onClick={() => navigate("/register")}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
