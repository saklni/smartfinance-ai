// src/components/onboarding/StepGoal.jsx

const GOALS = [
  {
    id: "save",
    title: "Menabung",
    desc: "Membangun dana darurat atau cadangan.",
    iconBg: "grey",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
      </svg>
    ),
  },
  {
    id: "reduce",
    title: "Mengurangi pengeluaran",
    desc: "Mengoptimalkan pengeluaran bulanan.",
    iconBg: "grey",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61l1.64-8.39H6"/>
        <line x1="4" y1="4" x2="20" y2="20" stroke="#6b7280" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    id: "invest",
    title: "Investasi",
    desc: "Mengembangkan aset untuk jangka panjang.",
    iconBg: "indigo",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
  {
    id: "others",
    title: "Lainnya",
    desc: "Tujuan keuangan lainnya.",
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

export default function StepGoal({ nextStep, prevStep, selected, setSelected }) {
  return (
    <div className="ob-card">
      <h1 className="ob-title" style={{ marginBottom: 12 }}>
        Apa tujuan keuangan Anda?
      </h1>
      <p className="ob-subtitle" style={{ marginBottom: 28 }}>
        Kami akan menyesuaikan fitur dan insight berdasarkan tujuan yang ingin Anda capai.
      </p>

      <div className="ob-select-grid">
        {GOALS.map((goal) => {
          const isSel = selected === goal.id;
          return (
            <div
              key={goal.id}
              className={`ob-select-card${isSel ? " selected" : ""}`}
              onClick={() => setSelected(goal.id)}
            >
              <div className={`ob-select-icon ${isSel ? "selected-bg" : goal.iconBg}`}>
                {goal.icon}
              </div>
              <div className="ob-select-text">
                <div className="ob-select-title">{goal.title}</div>
                <div className="ob-select-desc">{goal.desc}</div>
              </div>
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