// src/pages/user/Onboarding.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import StepIncome from "../../components/onboarding/StepIncome";
import StepExpense from "../../components/onboarding/StepExpense";
import StepGoal from "../../components/onboarding/StepGoal";
import StepAI from "../../components/onboarding/StepAI";
import { userService } from "../../services/userService";
import "../../styles/Onboarding.css";

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [onboardingData, setOnboardingData] = useState({
    monthlyIncome: 0,    // → monthly_income
    mainExpense: "transport",  // → main_expense
    financialGoal: "invest",   // → financial_goal
    aiEnabled: true,     // → ai_enabled
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    const savedTheme = localStorage.getItem("sf-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, [user, navigate]);

  const nextStep = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateOnboardingData = (newData) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await userService.updateUser({
        onboarding_completed: true,
        monthlyIncome: onboardingData.monthlyIncome,
        mainExpense: onboardingData.mainExpense,
        financialGoal: onboardingData.financialGoal,
        aiEnabled: onboardingData.aiEnabled,
      });

      // Pastikan state auth ter-update dengan data terbaru dari localStorage
      const finalUser = { ...updatedUser, onboarding_completed: true };
      localStorage.setItem("user", JSON.stringify(finalUser));
      updateUser(finalUser);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      alert("Gagal menyelesaikan onboarding. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = (step / TOTAL_STEPS) * 100;

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="onboarding-root">
      {/* HEADER */}
      <header className="ob-header">
        <a className="ob-logo" href="/" onClick={e => { e.preventDefault(); navigate("/"); }}>
          <button
            className="ob-back-icon"
            onClick={step > 1 ? prevStep : undefined}
            aria-label="back"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <span>Smart <span className="accent">Finance</span> AI</span>
        </a>
        <button className="ob-help-icon" aria-label="help">?</button>
      </header>

      {/* PROGRESS */}
      <div className="ob-progress-wrap">
        <div className="ob-progress-meta">
          <span className="ob-step-label">Step {step} of {TOTAL_STEPS}</span>
          <span className={`ob-pct-label ${step < 4 ? "grey" : ""}`}>
            {progressPercent.toFixed(0)}% {step >= 3 ? "Complete" : ""}
          </span>
        </div>
        <div className="ob-progress-track">
          <div className="ob-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* CONTENT */}
      <main className="ob-content">
        {step === 1 && (
          <StepIncome
            nextStep={nextStep}
            income={onboardingData.monthlyIncome}
            setIncome={val => updateOnboardingData({ monthlyIncome: Number(val) || 0 })}
          />
        )}
        {step === 2 && (
          <StepExpense
            nextStep={nextStep}
            prevStep={prevStep}
            selected={onboardingData.mainExpense}
            setSelected={val => updateOnboardingData({ mainExpense: val })}
          />
        )}
        {step === 3 && (
          <StepGoal
            nextStep={nextStep}
            prevStep={prevStep}
            selected={onboardingData.financialGoal}
            setSelected={val => updateOnboardingData({ financialGoal: val })}
          />
        )}
        {step === 4 && (
          <StepAI
            prevStep={prevStep}
            onFinish={handleFinish}
            aiEnabled={onboardingData.aiEnabled}
            setAiEnabled={(val) => {
              const next = typeof val === "function" ? val(onboardingData.aiEnabled) : val;
              updateOnboardingData({ aiEnabled: next });
            }}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}