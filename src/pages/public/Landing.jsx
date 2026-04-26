// src/pages/public/landing.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/landing.css";

// ─── HERO IMAGE ─────────────────────────────────────────────
let heroSrc;
try {
  heroSrc = new URL("../../assets/images/HERO.png", import.meta.url).href;
} catch {
  heroSrc = null;
}

// ─── FEATURES DATA ──────────────────────────────────────────
const features = [
  {
    id: 1,
    icon: "🗂",
    title: "Income & Expense Input",
    desc: "Seamlessly sync accounts or manually log transactions with lightning speed. AI categorizes everything instantly.",
    variant: "",
  },
  {
    id: 2,
    icon: "✦",
    title: "Smart Categories",
    desc: "Auto-tagging learns from your habits, organizing your spending into meaningful buckets.",
    variant: "purple",
  },
  {
    id: 3,
    icon: "⊞",
    title: "Personalized Dashboard",
    desc: "Your entire financial life in a single, high-fidelity overview.",
    variant: "",
  },
  {
    id: 4,
    icon: "📈",
    title: "Spending Analysis",
    desc: "Deep dive into where your money goes with behavioral patterns and trend forecasting.",
    variant: "",
  },
];

// ─── STEPS DATA ──────────────────────────────────────────────
const steps = [
  {
    id: 1,
    icon: "⇥",
    label: "1. Input",
    desc: "Connect your bank or scan receipts. We handle the data entry.",
  },
  {
    id: 2,
    icon: "🔍",
    label: "2. Analyze",
    desc: "AI scans thousands of data points to find hidden patterns.",
  },
  {
    id: 3,
    icon: "✦",
    label: "3. Insights",
    desc: "Get actionable reports that help you spend less and save more.",
  },
];

// ─── NAVBAR HEIGHT (px) — adjust if you change navbar height ──
const NAVBAR_HEIGHT = 68;

// ─── COMPONENT ───────────────────────────────────────────────
export default function Landing() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Section refs for smooth scroll + active detection
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const footerRef = useRef(null);

  // Scroll-reveal refs
  const revealRefs = useRef([]);

  // ── Apply theme ────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // ── Smooth scroll with offset (accounts for fixed navbar) ──
  const scrollToSection = useCallback((ref) => {
    setMenuOpen(false);
    if (!ref?.current) return;
    const top =
      ref.current.getBoundingClientRect().top +
      window.scrollY -
      NAVBAR_HEIGHT;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  // ── Active section tracking via IntersectionObserver ───────
  useEffect(() => {
    // Map each section id → ref
    const sections = [
      { id: "home", ref: heroRef },
      { id: "features", ref: featuresRef },
      { id: "how-it-works", ref: howItWorksRef },
      { id: "contact", ref: footerRef },
    ];

    // rootMargin pushes the "trigger line" down by navbar height
    // so the section is considered active when its top clears the navbar
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.dataset.section);
          }
        });
      },
      {
        rootMargin: `-${NAVBAR_HEIGHT}px 0px -55% 0px`,
        threshold: 0,
      }
    );

    sections.forEach(({ id, ref }) => {
      if (ref.current) {
        ref.current.dataset.section = id;
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  // ── Scroll-reveal observer ─────────────────────────────────
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealRefs.current.forEach((el) => {
      if (el) revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, []);

  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  // ── CTA handler ───────────────────────────────────────────
  const handleGetStarted = () => {
    window.location.href = "/login";
  };

  // ── Helper: nav link class ─────────────────────────────────
  const navClass = (id) => (activeSection === id ? "nav-active" : "");

  return (
    <>
      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <span className="navbar-logo">
            Smart<span>Finance</span> AI
          </span>

          {/* Desktop Links */}
          <ul className="navbar-links">
            <li>
              <a
                className={navClass("home")}
                href="#home"
                onClick={(e) => { e.preventDefault(); scrollToSection(heroRef); }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                className={navClass("features")}
                href="#features"
                onClick={(e) => { e.preventDefault(); scrollToSection(featuresRef); }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                className={navClass("how-it-works")}
                href="#how-it-works"
                onClick={(e) => { e.preventDefault(); scrollToSection(howItWorksRef); }}
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                className={navClass("contact")}
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection(footerRef); }}
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Right side */}
          <div className="navbar-right">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className="btn-get-started" onClick={handleGetStarted}>
              Get Started
            </button>

            {/* Hamburger */}
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <a
            className={navClass("home")}
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection(heroRef); }}
          >
            Home
          </a>
          <a
            className={navClass("features")}
            href="#features"
            onClick={(e) => { e.preventDefault(); scrollToSection(featuresRef); }}
          >
            Features
          </a>
          <a
            className={navClass("how-it-works")}
            href="#how-it-works"
            onClick={(e) => { e.preventDefault(); scrollToSection(howItWorksRef); }}
          >
            How It Works
          </a>
          <a
            className={navClass("contact")}
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection(footerRef); }}
          >
            Contact
          </a>
          <a className="btn-mobile-started" href="/login">
            Get Started
          </a>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <section className="hero" id="home" ref={heroRef}>
        <div className="hero-inner">
          {/* Left: text */}
          <div className="hero-content">
            <h1
              className="reveal"
              ref={addReveal}
            >
              Manage Your Money
              <span className="blue">Smarter with AI</span>
            </h1>
            <p
              className="reveal reveal-delay-1"
              ref={addReveal}
            >
              Experience the next generation of personal finance. Automated
              tracking, predictive analysis, and intelligent insights designed
              to grow your wealth.
            </p>
            <button
              className="btn-hero reveal reveal-delay-2"
              ref={addReveal}
              onClick={handleGetStarted}
            >
              Get Started Free
            </button>
          </div>

          {/* Right: image */}
          <div className="hero-image reveal reveal-delay-3" ref={addReveal}>
            {heroSrc ? (
              <img src={heroSrc} alt="Smart Finance AI Dashboard Preview" />
            ) : (
              /* Fallback placeholder when no image is present */
              <div
                style={{
                  width: "100%",
                  minHeight: "340px",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, #eef0ff 0%, #dde3ff 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  color: "#3b5bfc",
                  fontSize: "1rem",
                  fontWeight: 600,
                  border: "1px dashed #b4bffe",
                }}
              >
                <span style={{ fontSize: "3rem" }}>📊</span>
                <span>Place HERO.png in src/assets/images/</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES SECTION
      ════════════════════════════════════════ */}
      <section className="features" id="features" ref={featuresRef}>
        <div className="features-inner">
          <p className="section-label reveal" ref={addReveal}>
            CAPABILITIES
          </p>
          <h2 className="section-title reveal reveal-delay-1" ref={addReveal}>
            Powerful Intelligence
          </h2>

          <div className="features-grid">
            {/* 4 feature cards */}
            {features.map((f, i) => (
              <div
                key={f.id}
                className={`feature-card ${f.variant} reveal reveal-delay-${(i % 3) + 1}`}
                ref={addReveal}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}

            {/* Full-width AI Recommendations card */}
            <div
              className="feature-card full-width reveal reveal-delay-2"
              ref={addReveal}
            >
              <div className="feature-content">
                <h3>AI Recommendations</h3>
                <p>
                  Our engine analyzes your history to suggest savings
                  opportunities and investment strategies tailored to your
                  goals.
                </p>
              </div>
              <button className="btn-activate" onClick={handleGetStarted}>
                Activate Insights
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS SECTION
      ════════════════════════════════════════ */}
      <section className="how-it-works" id="how-it-works" ref={howItWorksRef}>
        <div className="how-it-works-inner">
          <h2 className="section-title reveal" ref={addReveal}>
            The Path to Prosperity
          </h2>
          <p className="section-subtitle reveal reveal-delay-1" ref={addReveal}>
            Three simple steps to financial clarity.
          </p>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`step reveal reveal-delay-${i + 1}`}
                ref={addReveal}
              >
                <div className="step-icon-wrap">{s.icon}</div>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER / CONTACT SECTION
      ════════════════════════════════════════ */}
      <footer className="footer" id="contact" ref={footerRef}>
        <div className="footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <span className="navbar-logo">
              Smart<span>Finance</span> AI
            </span>
            <p>© 2026 Smart Finance AI. Precision in every transaction.</p>
          </div>

          {/* Company links */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Social icons */}
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="footer-socials">
              <button className="social-btn" aria-label="Twitter / X">
                𝕏
              </button>
              <button className="social-btn" aria-label="LinkedIn">
                in
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Smart Finance AI. All rights reserved.</p>
          <p>Built with ❤️ for smarter finances.</p>
        </div>
      </footer>
    </>
  );
}