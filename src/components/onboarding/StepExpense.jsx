// src/components/onboarding/StepExpense.jsx

const EXPENSES = [
  {
    id: "food",
    title: "Makanan",
    desc: "Makan, belanja bahan makanan, delivery",
    iconBg: "purple",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/>
        <path d="M7 2v20"/>
        <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
  },
  {
    id: "transport",
    title: "Transportasi",
    desc: "BBM, transport umum, ojek/ride",
    iconBg: "blue",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    id: "shopping",
    title: "Belanja",
    desc: "Pakaian, gadget, kebutuhan rumah",
    iconBg: "green",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    id: "entertainment",
    title: "Hiburan",
    desc: "Film, game, acara",
    iconBg: "red",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2"/>
      </svg>
    ),
  },
  {
    id: "others",
    title: "Lainnya",
    desc: "Tagihan, kesehatan, pendidikan, dll",
    iconBg: "grey",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/>
        <circle cx="19" cy="12" r="1"/>
        <circle cx="5" cy="12" r="1"/>
      </svg>
    ),
  },
];

export default function StepExpense({ nextStep, prevStep, selected, setSelected }) {
  return (
    <div className="ob-card">
      <h1 className="ob-title" style={{ textAlign: "left", marginBottom: 10 }}>
        Pengeluaran utama Anda apa?
      </h1>
      <p className="ob-subtitle" style={{ textAlign: "left", marginBottom: 24 }}>
        Ini membantu sistem memahami pola pengeluaran Anda dan mengelompokkan transaksi secara otomatis.
      </p>

      <div className="ob-select-grid full-last">
        {EXPENSES.map((exp) => {
          const isSel = selected === exp.id;
          return (
            <div
              key={exp.id}
              className={`ob-select-card${isSel ? " selected" : ""}`}
              onClick={() => setSelected(exp.id)}
            >
              <div className={`ob-select-icon ${isSel ? "selected-bg" : exp.iconBg}`}>
                {exp.icon}
              </div>
              <div className="ob-select-text">
                <div className="ob-select-title">{exp.title}</div>
                <div className="ob-select-desc">{exp.desc}</div>
              </div>
              {isSel && (
                <span className="ob-check">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                    stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2,6 5,9 10,3"/>
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="ob-nav">
        <button className="btn-back" onClick={prevStep}>Kembali</button>
        <button className="btn-next" onClick={nextStep}>Lanjut</button>
      </div>
    </div>
  );
}