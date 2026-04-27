// src/pages/user/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { transactionService } from "../../services/transactionService";
import { categoryService } from "../../services/categoryService";
import { aiInsightService } from "../../services/aiInsightService";
import "../../styles/dashboard.css";

/* ── helpers ──────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

/* icon lookup per kategori */
const CATEGORY_ICON = {
  food: "🍽️", grocery: "🛒", transport: "🚗", shopping: "🛍️",
  entertainment: "🎬", salary: "💼", freelance: "💻",
  bills: "⚡", utilities: "⚡", investment: "📈",
  health: "💊", education: "📚", others: "📦",
};

const getCatIcon = (name = "") => {
  const key = name.toLowerCase();
  return Object.entries(CATEGORY_ICON).find(([k]) => key.includes(k))?.[1] ?? "💳";
};

/* mock chart data (6 bulan terakhir) */
const CHART_DATA = [
  { month: "JAN", income: 72, expense: 28 },
  { month: "FEB", income: 58, expense: 30 },
  { month: "MAR", income: 65, expense: 32 },
  { month: "APR", income: 80, expense: 48 },
  { month: "MAY", income: 70, expense: 30 },
  { month: "JUN", income: 55, expense: 22 },
];

/* ── Component ────────────────────────────────────────────── */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [insights, setInsights] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("sf-theme") || "light");

  /* ── load data ── */
  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    const load = async () => {
      try {
        const [txData, catData, sumData, insData] = await Promise.all([
          transactionService.getTransactionsByUser(user.id),
          categoryService.getCategoriesByUser(user.id),
          transactionService.getSummary(user.id),
          aiInsightService.getInsightsByUser(user.id),
        ]);
        setTransactions(txData);
        setCategories(catData);
        setSummary(sumData);
        setInsights(insData);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [user, navigate]);

  /* ── theme toggle ── */
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("sf-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* ── helpers ── */
  const getCatName = (id) => categories.find((c) => c.id === id)?.name ?? "";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Loading…</div>
      </div>
    );
  }

  const firstInsight = insights[0];

  /* ── Spending Analysis dari transaksi ── */
  const spendingMap = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    const name = getCatName(t.category_id) || "Others";
    spendingMap[name] = (spendingMap[name] || 0) + t.amount;
  });
  const totalSpend = Object.values(spendingMap).reduce((a, b) => a + b, 0) || 1;
  const spendingItems = Object.entries(spendingMap)
    .map(([name, amt]) => ({ name, pct: Math.round((amt / totalSpend) * 100) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 4);

  const FILL_COLORS = ["blue", "green", "red", "gray"];

  return (
    <>
      {/* ══ NAVBAR ══════════════════════════════════════════ */}
      <nav className="sf-navbar">
        <span className="sf-navbar__brand">Smart Finance AI</span>

        <div className="sf-navbar__nav">
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/insights">Insights</Link>
        </div>

        <div className="sf-navbar__right">
          <button className="sf-navbar__icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div
            className="sf-navbar__avatar"
            onClick={() => logout() || navigate("/login")}
            title="Logout"
          >
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        </div>
      </nav>

      {/* ══ PAGE ════════════════════════════════════════════ */}
      <main className="sf-page">

        {/* Page Header */}
        <div className="sf-page-header">
          <div>
            <p className="sf-page-header__label">Overview Dashboard</p>
            <h1 className="sf-page-header__title">
              {greeting()}, {user?.name || "User"}.
            </h1>
          </div>
          <button className="sf-btn-add" onClick={() => navigate("/transactions")}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            Add Transaction
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="sf-summary-grid">

          {/* Balance */}
          <div className="sf-summary-card">
            <div className="sf-summary-card__header">
              <div className="sf-summary-card__icon sf-summary-card__icon--balance">🗂</div>
              <span className="sf-summary-card__label">Total Balance</span>
            </div>
            <div className="sf-summary-card__value sf-summary-card__value--balance">
              {fmt(summary.balance)}
            </div>
            <span className="sf-summary-card__badge sf-summary-card__badge--up">
              ↗ +4.2% from last month
            </span>
          </div>

          {/* Income */}
          <div className="sf-summary-card">
            <div className="sf-summary-card__header">
              <div className="sf-summary-card__icon sf-summary-card__icon--income">↑</div>
              <span className="sf-summary-card__label">Total Income</span>
            </div>
            <div className="sf-summary-card__value sf-summary-card__value--income">
              {fmt(summary.totalIncome)}
            </div>
            <span className="sf-summary-card__badge sf-summary-card__badge--verified">
              ✓ Verified
            </span>
          </div>

          {/* Expenses */}
          <div className="sf-summary-card">
            <div className="sf-summary-card__header">
              <div className="sf-summary-card__icon sf-summary-card__icon--expense">↓</div>
              <span className="sf-summary-card__label">Total Expenses</span>
            </div>
            <div className="sf-summary-card__value sf-summary-card__value--expense">
              {fmt(summary.totalExpense)}
            </div>
            <span className="sf-summary-card__badge sf-summary-card__badge--budget">
              Under Budget
            </span>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="sf-main-grid">

          {/* LEFT COLUMN */}
          <div>
            {/* Growth Projection Chart */}
            <div className="sf-chart-card">
              <div className="sf-chart-card__header">
                <div>
                  <div className="sf-chart-card__title">Growth Projection</div>
                  <div className="sf-chart-card__subtitle">Cash flow comparison over 6 months</div>
                </div>
                <div className="sf-chart-legend">
                  <div className="sf-chart-legend__item">
                    <div className="sf-chart-legend__dot" style={{ background: "#a8bcff" }} />
                    Income
                  </div>
                  <div className="sf-chart-legend__item">
                    <div className="sf-chart-legend__dot" style={{ background: "#ff9490" }} />
                    Expenses
                  </div>
                </div>
              </div>

              <div className="sf-bar-chart">
                {CHART_DATA.map((d) => (
                  <div key={d.month} className="sf-bar-group">
                    <div className="sf-bar-group__bars">
                      <div
                        className="sf-bar sf-bar--income"
                        style={{ height: `${d.income}%`, flex: 1 }}
                      />
                      <div
                        className="sf-bar sf-bar--expense"
                        style={{ height: `${d.expense}%`, flex: 1 }}
                      />
                    </div>
                    <span className="sf-bar-group__label">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="sf-tx-card">
              <div className="sf-tx-card__header">
                <span className="sf-tx-card__title">Transaksi Terbaru</span>
                <Link to="/transactions" className="sf-tx-card__viewall">
                  View All &rsaquo;
                </Link>
              </div>

              <div className="sf-tx-list">
                {transactions.length === 0 ? (
                  <div className="sf-empty">Belum ada transaksi.</div>
                ) : (
                  transactions.slice(0, 5).map((tx) => {
                    const catName = getCatName(tx.category_id);
                    return (
                      <div key={tx.id} className="sf-tx-item">
                        <div className="sf-tx-item__icon">
                          {getCatIcon(catName)}
                        </div>
                        <div className="sf-tx-item__info">
                          <div className="sf-tx-item__name">{tx.note}</div>
                          <div className="sf-tx-item__meta">
                            {catName} • {fmtDate(tx.date)}
                          </div>
                        </div>
                        <span
                          className={`sf-tx-item__amount sf-tx-item__amount--${tx.type}`}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {fmt(tx.amount)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="sf-sidebar">

            {/* AI Insight */}
            <div className="sf-ai-card">
              <div className="sf-ai-card__badge">
                ✦ AI Advisor
              </div>
              <div className="sf-ai-card__title">Portfolio Insights</div>
              {firstInsight ? (
                <>
                  <p className="sf-ai-card__text">{firstInsight.insight_text}</p>
                  <div className="sf-ai-card__quote">
                    "Action: Cancel 2 unused subscriptions to save $45/mo."
                  </div>
                </>
              ) : (
                <p className="sf-ai-card__text">
                  Add more transactions so our AI can analyze your spending patterns.
                </p>
              )}
              <button className="sf-ai-card__btn">Apply Strategy</button>
            </div>

            {/* Spending Analysis */}
            <div className="sf-spending-card">
              <div className="sf-spending-card__title">Spending Analysis</div>
              <div className="sf-spending-list">
                {spendingItems.length === 0 ? (
                  <div className="sf-empty">Belum ada data pengeluaran.</div>
                ) : (
                  spendingItems.map((item, i) => (
                    <div key={item.name}>
                      <div className="sf-spending-item__header">
                        <span className="sf-spending-item__name">{item.name}</span>
                        <span className="sf-spending-item__pct">{item.pct}%</span>
                      </div>
                      <div className="sf-spending-item__bar">
                        <div
                          className={`sf-spending-item__fill sf-spending-item__fill--${FILL_COLORS[i]}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="sf-spending-card__footer">
                Most expensive day: Friday
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}