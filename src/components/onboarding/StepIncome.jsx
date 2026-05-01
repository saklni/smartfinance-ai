export default function StepIncome({ nextStep, income, setIncome }) {
  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setIncome(raw);
  };

  const displayValue = income ? Number(income).toLocaleString("id-ID") : "";

  return (
    <div className="ob-card">
      <div className="income-icon-wrap">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <circle cx="12" cy="12" r="2"/>
          <path d="M6 12h.01M18 12h.01"/>
        </svg>
      </div>

      <h1 className="ob-title">Berapa penghasilan bulanan Anda?</h1>
      <p className="ob-subtitle">
        Masukkan rata-rata penghasilan bersih Anda untuk membantu mengelola keuangan Anda dengan lebih baik.
      </p>

      <div className="income-input-wrap">
        <span className="income-dollar">Rp</span>
        <input
          className="income-input"
          type="text"
          inputMode="numeric"
          placeholder="0.000"
          value={displayValue}
          onChange={handleInput}
          autoFocus
        />
      </div>

      <div className="ob-btn-center">
        <button 
          className="btn-next-arrow" 
          onClick={nextStep}
          disabled={!income || income === "0"}
        >
          Lanjut
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}