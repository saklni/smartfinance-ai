// src/pages/user/Transactions.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";
import { transactionService } from "../../services/transactionService";
import { categoryService } from "../../services/categoryService";

export default function Transactions() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    amount: "",
    note: "",
    category_id: "",
    date: new Date().toISOString().split("T")[0]
  });

  // Load transaksi + kategori
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const [txData, catData] = await Promise.all([
          transactionService.getTransactionsByUser(user.id),
          categoryService.getCategoriesByUser(user.id)
        ]);
        setTransactions(txData);
        setCategories(catData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validasi — category_id NN di ERD
    if (!newTransaction.amount || Number(newTransaction.amount) <= 0)
      return setFormError("Masukkan jumlah yang valid.");
    if (!newTransaction.note.trim())
      return setFormError("Catatan tidak boleh kosong.");
    if (!newTransaction.category_id)
      return setFormError("Pilih kategori transaksi.");

    setSubmitting(true);
    try {
      const created = await transactionService.createTransaction({
        user_id: user.id,
        type: newTransaction.type,
        amount: Number(newTransaction.amount),
        note: newTransaction.note.trim(),
        date: newTransaction.date,
        category_id: Number(newTransaction.category_id)  // pastikan integer, bukan null
      });

      // Update state langsung — tidak perlu reload
      setTransactions(prev => [created, ...prev]);
      setNewTransaction({
        type: "expense",
        amount: "",
        note: "",
        category_id: "",
        date: new Date().toISOString().split("T")[0]
      });
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setFormError("Gagal menambahkan transaksi. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (txId) => {
    if (!window.confirm("Hapus transaksi ini?")) return;
    try {
      await transactionService.deleteTransaction(txId);
      setTransactions(prev => prev.filter(tx => tx.id !== txId));
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  };

  // Helper: ambil nama kategori dari category_id
  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : "-";
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  // Filter kategori sesuai tipe transaksi yang dipilih di form
  const filteredCategories = categories.filter(
    c => c.type === newTransaction.type
  );

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Transaction"}
        </button>
      </div>

      <div className="filter-tabs">
        {["all", "income", "expense"].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="transaction-form">
          {formError && (
            <div style={{ color: "#ef4444", marginBottom: 8, fontSize: 14 }}>
              {formError}
            </div>
          )}
          <form onSubmit={handleAddTransaction}>
            {/* Type */}
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction(prev => ({
                ...prev,
                type: e.target.value,
                category_id: "" // reset kategori saat ganti type
              }))}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            {/* Amount */}
            <input
              type="number"
              placeholder="Amount"
              min="1"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
              required
            />

            {/* Note */}
            <input
              type="text"
              placeholder="Note"
              value={newTransaction.note}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, note: e.target.value }))}
              required
            />

            {/* Category — wajib diisi (NN di ERD) */}
            <select
              value={newTransaction.category_id}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, category_id: e.target.value }))}
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Date */}
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
            />

            <div className="form-buttons">
              <button type="button" onClick={() => { setShowForm(false); setFormError(""); }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <p>Belum ada transaksi.</p>
        ) : (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="transaction-item">
              <div className="transaction-info">
                <strong>{tx.note}</strong>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
                  {getCategoryName(tx.category_id)} · {new Date(tx.date).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className={`transaction-amount ${tx.type}`}>
                  {tx.type === "income" ? "+" : "-"} Rp {tx.amount.toLocaleString("id-ID")}
                </div>
                <button
                  onClick={() => handleDelete(tx.id)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#ef4444", fontSize: 16, padding: "0 4px"
                  }}
                  aria-label="Hapus transaksi"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
