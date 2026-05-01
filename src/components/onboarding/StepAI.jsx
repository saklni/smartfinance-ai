// src/components/onboarding/StepAI.jsx

const AI_FEATURES = [
  {
    id: "trend",
    title: "Deteksi Tren",
    desc: "Analisis pengeluaran berdasarkan riwayat.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    id: "goals",
    title: "Target Pintar",
    desc: "Penyesuaian tabungan secara otomatis.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    id: "feed",
    title: "Rekomendasi",
    desc: "Insight keuangan yang disesuaikan untuk Anda.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
];

export default function StepAI({ 
  prevStep, 
  onFinish, 
  aiEnabled, 
  setAiEnabled, 
  loading = false 
}) {
  return (
    <div className="ob-card">
      <div className="ai-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>

      <h1 className="ob-title" style={{ marginBottom: 14 }}>
        Fitur AI
      </h1>
      <p className="ob-subtitle" style={{ marginBottom: 24 }}>
        Aktifkan AI untuk membantu menganalisis pengeluaran,<br/>
        memberikan insight, dan rekomendasi keuangan secara otomatis.
      </p>

      <div className="ai-toggle-row">
        <span className="ai-toggle-label">Aktifkan rekomendasi AI?</span>
        <button
          className={`toggle-switch${aiEnabled ? "" : " off"}`}
          onClick={() => setAiEnabled((v) => !v)}
          aria-label="Toggle AI recommendations"
        >
          <span className="toggle-knob" />
        </button>
      </div>

      <div className="ai-features-grid">
        {AI_FEATURES.map((f) => (
          <div className="ai-feature-card" key={f.id}>
            <div className="ai-feature-icon">{f.icon}</div>
            <div className="ai-feature-title">{f.title}</div>
            <div className="ai-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      <div className="ob-nav">
        <button className="btn-back" onClick={prevStep}>Kembali</button>
        <button 
          className="btn-next" 
          onClick={onFinish}
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Selesai"}
        </button>
      </div>
    </div>
  );
}