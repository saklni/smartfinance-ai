// src/pages/user/AddTransaction.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { transactionService } from "../../services/transactionService";
import { categoryService } from "../../services/categoryService";
import "../../styles/addTransaction.css";

export default function AddTransaction() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  /* load categories */
  useEffect(() => {
    if (!user) { navigate("/login", { replace: true }); return; }
    categoryService.getCategoriesByUser(user.id).then(setCategories).catch(console.error);
  }, [user, navigate]);

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /* format amount display */
  const displayAmount = form.amount
    ? Number(form.amount).toLocaleString("id-ID")
    : "";

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, amount: raw }));
  };

  const handleTypeToggle = (type) => {
    setForm((prev) => ({ ...prev, type, category_id: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount || Number(form.amount) <= 0)
      return setError("Masukkan jumlah yang valid.");
    if (!form.category_id)
      return setError("Pilih kategori terlebih dahulu.");
    if (!form.date)
      return setError("Pilih tanggal transaksi.");

    setSubmitting(true);
    try {
      await transactionService.createTransaction({
        user_id: user.id,
        type: form.type,
        amount: Number(form.amount),
        category_id: Number(form.category_id),
        date: form.date,
        note: form.note.trim() || "-",
      });
      navigate("/transactions", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan transaksi. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="at-page">

      {/* ── Top Bar ── */}
      <div className="at-topbar">
        <button className="at-topbar__back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <span className="at-topbar__brand">Smart Finance AI</span>
      </div>

      {/* ── Card ── */}
      <div className="at-card-wrap">
        <div className="at-card">
          <h1 className="at-card__title">Add Transaction</h1>
          <p className="at-card__subtitle">
            Record a new movement in your financial ecosystem.
          </p>

          {error && <div className="at-error">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Transaction Type */}
            <label className="at-field-label">Transaction Type</label>
            <div className="at-type-group">
              <button
                type="button"
                className={`at-type-btn ${form.type === "expense" ? "active--expense" : ""}`}
                onClick={() => handleTypeToggle("expense")}
              >
                <span className="at-type-btn__icon">↓</span>
                Expense
              </button>
              <button
                type="button"
                className={`at-type-btn ${form.type === "income" ? "active--income" : ""}`}
                onClick={() => handleTypeToggle("income")}
              >
                <span className="at-type-btn__icon">↑</span>
                Income
              </button>
            </div>

            {/* Amount */}
            <div className="at-amount-wrap">
              <label className="at-field-label">Amount</label>
              <div className="at-amount-box">
                <span className="at-amount-currency">Rp</span>
                <input
                  className="at-amount-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="0.00"
                  value={displayAmount}
                  onChange={handleAmountChange}
                  autoFocus
                />
              </div>
            </div>

            {/* Category + Date */}
            <div className="at-row">
              <div>
                <label className="at-field-label">Category</label>
                <div className="at-select-wrap">
                  <select
                    className="at-select"
                    value={form.category_id}
                    onChange={set("category_id")}
                    required
                  >
                    <option value="">Select category</option>
                    {filteredCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="at-field-label">Date</label>
                <div className="at-date-wrap">
                  <input
                    className="at-input"
                    type="date"
                    value={form.date}
                    onChange={set("date")}
                    required
                  />
                  <span className="at-date-icon">📅</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="at-textarea-wrap">
              <label className="at-field-label">Notes (Optional)</label>
              <textarea
                className="at-textarea"
                placeholder="What was this for?"
                value={form.note}
                onChange={set("note")}
                rows={3}
              />
            </div>

            {/* Footer */}
            <div className="at-footer">
              <button
                type="button"
                className="at-btn-cancel"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="at-btn-save"
                disabled={submitting}
              >
                <span className="at-btn-save__icon">✓</span>
                {submitting ? "Menyimpan…" : "Save Transaction"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}