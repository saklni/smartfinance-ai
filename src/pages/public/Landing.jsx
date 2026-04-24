import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/landing.css";

/* ─── Data ──────────────────────────────────────────────────── */

const NAV_LINKS = ["Home", "Features", "How It Works", "Contact"];

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="18" rx="3" stroke="#4F46E5" strokeWidth="1.8" />
        <path d="M7 8h10M7 12h6" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="16" cy="15" r="3" fill="#4F46E5" opacity="0.15" stroke="#4F46E5" strokeWidth="1.5" />
        <path d="M15 15l.8.8L17 14" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Income & Expense Input",
    desc: "Seamlessly sync accounts or manually log transactions with lightning speed. AI categorizes everything instantly.",
    accent: false,
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h10M4 18h7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="18" cy="16" r="4" fill="white" opacity="0.2" stroke="white" strokeWidth="1.5" />
        <path d="M16.5 16l1 1 2-2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Smart Categories",
    desc: "Auto-tagging learns from your habits, organizing your spending into meaningful buckets.",
    accent: true,
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="2" width="9" height="9" rx="2" stroke="#4F46E5" strokeWidth="1.8" />
        <rect x="13" y="2" width="9" height="9" rx="2" stroke="#4F46E5" strokeWidth="1.8" />
        <rect x="2" y="13" width="9" height="9" rx="2" stroke="#4F46E5" strokeWidth="1.8" />
        <path d="M17 13v9M13 17h9" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    title: "Personalized Dashboard",
    desc: "Your entire financial life in a single, high-fidelity overview.",
    accent: false,
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M3 17l4-5 4 3 4-6 4 4" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="5" r="3" fill="#4F46E5" opacity="0.15" stroke="#4F46E5" strokeWidth="1.5" />
        <path d="M18 5l.8.8L20.5 4" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Spending Analysis",
    desc: "Deep dive into where your money goes with behavioral patterns and trend forecasting.",
    accent: false,
  },
];

const STEPS = [
  {
    num: "1",
    label: "Input",
    desc: "Connect your bank or scan receipts. We handle the data entry.",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#4F46E5" strokeWidth="1.8" />
        <path d="M8 12h8M12 8v8" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "2",
    label: "Analyze",
    desc: "AI scans thousands of data points to find hidden patterns.",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="#4F46E5" strokeWidth="1.8" />
        <path d="M12 7v5l3 3" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: "3",
    label: "Insights",
    desc: "Get actionable reports that help you spend less and save more.",
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path d="M12 2l1.5 4.5h4.5l-3.75 2.75 1.5 4.5L12 11.25l-3.75 2.5 1.5-4.5L6 6.5h4.5z" stroke="#4F46E5" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 14v7M8 21h8" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ─── Hook ──────────────────────────────────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ─── Main Component ────────────────────────────────────────── */

export default function SmartFinanceAI() {
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Section refs for smooth scroll navigation
  const heroSectionRef    = useRef(null);
  const featureSectionRef = useRef(null);
  const stepsSectionRef   = useRef(null);
  const footerRef         = useRef(null);

  // InView refs for scroll animations
  const [heroRef, heroIn]   = useInView(0.1);
  const [featRef, featIn]   = useInView(0.1);
  const [stepsRef, stepsIn] = useInView(0.1);

  const scrollToSection = (section) => {
    if (!section.current) return;
    const top = section.current.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`app${dark ? " dark" : ""}`}>

      {/* ── Navbar ── */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="navbar__inner">
          <span className="navbar__brand">Smart Finance AI</span>
          <div className="navbar__links">
            {NAV_LINKS.map((link, i) => (
              <span
                key={link}
                className={`nav-link${i === 0 ? " nav-link--active" : ""}`}
                onClick={() => {
                  if (link === "Home")         scrollToSection(heroSectionRef);
                  if (link === "Features")     scrollToSection(featureSectionRef);
                  if (link === "How It Works") scrollToSection(stepsSectionRef);
                  if (link === "Contact")      scrollToSection(footerRef);
                }}
              >
                {link}
              </span>
            ))}
          </div>
          <div className="navbar__actions">
            <button className="dark-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
              {dark ? "☀️" : "🌙"}
            </button>
            <button
              className="btn-primary btn-primary--sm"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="hero"
        ref={(el) => { heroSectionRef.current = el; heroRef.current = el; }}
      >
        <div>
          <h1 className={`hero__title fade-up${heroIn ? " in" : ""}`}>
            Manage Your Money
          </h1>
          <h1 className={`hero__title--gradient fade-up stagger-1${heroIn ? " in" : ""}`}>
            Smarter with AI
          </h1>
          <p className={`hero__desc fade-up stagger-2${heroIn ? " in" : ""}`}>
            Experience the next generation of personal finance. Automated tracking,
            predictive analysis, and intelligent insights designed to grow your wealth.
          </p>
          <button className={`btn-primary fade-up stagger-3${heroIn ? " in" : ""}`}>
            Get Started Free
          </button>
        </div>
        <div className={`hero__illustration fade-up stagger-4${heroIn ? " in" : ""}`}>
          <img
            src="/assets/image/HERO.png"
            alt="Smart Finance AI Dashboard"
            className="hero__image"
          />
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="capabilities" ref={featureSectionRef}>
        <div className="capabilities__inner" ref={featRef}>
          <div className="section-header">
            <span className="section-eyebrow">Capabilities</span>
            <h2 className="section-title">Powerful Intelligence</h2>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`feature-card ${f.accent ? "feature-card--accent" : "feature-card--default"} fade-up stagger-${i + 1}${featIn ? " in" : ""}`}
              >
                <div className="feature-card__icon-wrap">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className={`ai-banner fade-up stagger-5${featIn ? " in" : ""}`}>
            <div>
              <h3 className="ai-banner__title">AI Recommendations</h3>
              <p className="ai-banner__desc">
                Our engine analyzes your history to suggest savings opportunities and
                investment strategies tailored to your goals.
              </p>
            </div>
            <button className="btn-outline">Activate Insights</button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        className="how-it-works"
        ref={(el) => { stepsSectionRef.current = el; stepsRef.current = el; }}
      >
        <div className="how-it-works__header">
          <h2 className="how-it-works__title">The Path to Prosperity</h2>
          <p className="how-it-works__sub">Three simple steps to financial clarity.</p>
        </div>
        <div className="steps-grid">
          <div className="steps-connector" />
          {STEPS.map((s, i) => (
            <div key={s.label} className={`step fade-up stagger-${i + 1}${stepsIn ? " in" : ""}`}>
              <div className="step__icon-wrap">{s.icon}</div>
              <div className="step__label">{s.num}. {s.label}</div>
              <p className="step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer" ref={footerRef}>
        <div className="footer__inner">
          <div>
            <div className="footer__brand">Smart Finance AI</div>
            <div className="footer__copy">© 2024 Smart Finance AI. Precision in every transaction.</div>
          </div>
          <div className="footer__links">
            <div>
              <div className="footer__col-title">Company</div>
              {["About Us", "Careers", "Support"].map((l) => (
                <div key={l} className="footer__link">{l}</div>
              ))}
            </div>
            <div>
              <div className="footer__col-title">Legal</div>
              {["Privacy Policy", "Terms of Service"].map((l) => (
                <div key={l} className="footer__link">{l}</div>
              ))}
            </div>
          </div>
          <div className="footer__socials">
            {["𝕏", "in"].map((icon) => (
              <button key={icon} className="footer__social-btn">{icon}</button>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}