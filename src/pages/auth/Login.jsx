import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../../data/users";
import { roles } from "../../data/roles";
import "../../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Sync theme
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

    // Simulasi delay
    await new Promise((r) => setTimeout(r, 500));

    // Ambil user hasil register
    const storedUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // Gabungkan dengan dummy users
    const allUsers = [...users, ...storedUsers];

    // Cari user
    let foundUser = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    setLoading(false);

    if (!foundUser) {
      return setError("Invalid email or password. Please try again.");
    }

    if (foundUser.onboarding_completed === undefined) {
      foundUser = {
        ...foundUser,
        onboarding_completed: false,
      };
    }

    // Ambil role
    const role = roles.find((r) => r.id === foundUser.role_id);

    // Simpan session login
    localStorage.setItem("user", JSON.stringify(foundUser));

    if (role?.name === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }
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
              >
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

        {/* Footer */}
        <div className="auth-footer">
          <hr />
          <p className="auth-footer-text">Don't have an account?</p>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </div>

      </div>
    </div>
  );
}