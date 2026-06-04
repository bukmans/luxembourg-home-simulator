import { useState, useMemo, useCallback, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const colors = {
  navy: "#0A1628",
  navyMid: "#12213D",
  navyLight: "#1A2F52",
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  goldPale: "#F5E6B8",
  teal: "#1A8C7A",
  tealLight: "#24B89E",
  red: "#C0392B",
  redLight: "#E74C3C",
  cream: "#FAF7F0",
  text: "#1A1A2E",
  textMid: "#4A5568",
  textLight: "#718096",
  white: "#FFFFFF",
  border: "#D4C5A0",
};

const styles = {
  app: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: colors.cream,
    minHeight: "100vh",
    color: colors.text,
  },
  header: {
    background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyMid} 60%, ${colors.navyLight} 100%)`,
    padding: "40px 32px 32px",
    position: "relative",
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: "2.4rem",
    fontWeight: "700",
    color: colors.goldLight,
    margin: 0,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  },
  headerSub: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "0.95rem",
    marginTop: "8px",
    fontFamily: "'Helvetica Neue', sans-serif",
    letterSpacing: "0.04em",
  },
  badge: {
    display: "inline-block",
    background: colors.gold,
    color: colors.navy,
    fontSize: "0.68rem",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "20px",
    fontFamily: "'Helvetica Neue', sans-serif",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  tabs: {
    display: "flex",
    background: colors.navyMid,
    borderBottom: `3px solid ${colors.gold}`,
    overflowX: "auto",
  },
  tab: (active) => ({
    padding: "14px 24px",
    cursor: "pointer",
    fontSize: "0.82rem",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: active ? "700" : "400",
    color: active ? colors.gold : "rgba(255,255,255,0.55)",
    borderBottom: active ? `3px solid ${colors.gold}` : "3px solid transparent",
    marginBottom: "-3px",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    background: "none",
    border: "none",
    outline: "none",
  }),
  body: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 20px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "16px",
  },
  card: {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(10,22,40,0.07)",
  },
  cardTitle: {
    fontSize: "0.75rem",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "700",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: colors.textLight,
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "1.35rem",
    fontWeight: "700",
    color: colors.navy,
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: `2px solid ${colors.goldPale}`,
  },
  label: {
    display: "block",
    fontSize: "0.8rem",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "600",
    color: colors.textMid,
    marginBottom: "6px",
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${colors.border}`,
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: colors.text,
    background: colors.cream,
    fontFamily: "'Helvetica Neue', sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${colors.border}`,
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: colors.text,
    background: colors.cream,
    fontFamily: "'Helvetica Neue', sans-serif",
    boxSizing: "border-box",
    cursor: "pointer",
    outline: "none",
  },
  fieldGroup: { marginBottom: "18px" },
  btn: {
    background: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldLight} 100%)`,
    color: colors.navy,
    border: "none",
    borderRadius: "10px",
    padding: "14px 32px",
    fontSize: "0.9rem",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    boxShadow: "0 4px 16px rgba(201,168,76,0.35)",
    transition: "all 0.2s",
  },
  btnSecondary: {
    background: "transparent",
    color: colors.navy,
    border: `2px solid ${colors.border}`,
    borderRadius: "10px",
    padding: "12px 24px",
    fontSize: "0.85rem",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.03em",
  },
  benefitCard: (eligible) => ({
    background: eligible ? `linear-gradient(135deg, #f0faf7 0%, #e6f7f4 100%)` : "#fafafa",
    border: `1.5px solid ${eligible ? colors.tealLight : colors.border}`,
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "12px",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  }),
  benefitIcon: (eligible) => ({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: eligible ? colors.teal : "#e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    flexShrink: 0,
    color: colors.white,
  }),
  metricCard: (accent) => ({
    background: colors.white,
    border: `1.5px solid ${accent || colors.border}`,
    borderRadius: "10px",
    padding: "20px",
    borderTop: `4px solid ${accent || colors.gold}`,
  }),
  metricValue: {
    fontSize: "1.9rem",
    fontWeight: "700",
    color: colors.navy,
    lineHeight: 1,
  },
  metricLabel: {
    fontSize: "0.75rem",
    fontFamily: "'Helvetica Neue', sans-serif",
    color: colors.textLight,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginTop: "6px",
  },
  tag: (color) => ({
    display: "inline-block",
    background: color || colors.goldPale,
    color: color === colors.red ? colors.white : colors.navy,
    fontSize: "0.7rem",
    fontFamily: "'Helvetica Neue', sans-serif",
    fontWeight: "700",
    padding: "3px 9px",
    borderRadius: "4px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  }),
  infoBox: {
    background: `${colors.navyMid}10`,
    border: `1px solid ${colors.border}`,
    borderLeft: `4px solid ${colors.gold}`,
    borderRadius: "8px",
    padding: "14px 16px",
    fontSize: "0.85rem",
    fontFamily: "'Helvetica Neue', sans-serif",
    color: colors.textMid,
    lineHeight: 1.6,
    marginBottom: "16px",
  },
  divider: {
    height: "1px",
    background: colors.border,
    margin: "20px 0",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => "€" + Math.round(n).toLocaleString("fr-LU");
const fmtPct = (n) => n.toFixed(2) + "%";

function calcMonthlyPayment(principal, annualRate, years) {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ─── INCOME THRESHOLDS FOR BENEFITS ─────────────────────────────────────────
// Based on Luxembourg housing aid law (indexed values 2025/2026)
// These determine subsidy rate brackets
function getInterestSubsidyRate(monthlyNetIncome, children, isCoupleOrFamily) {
  // Simplified bracket model based on official docs
  // Single: up to ~€2,500 = 3.5%, ~€3,500 = 2.5%, ~€4,500 = 1.5%, ~€5,500 = 0.75%, above = 0.25%
  // Couple/family: thresholds ~40% higher
  const multiplier = isCoupleOrFamily ? 1.4 : 1.0;
  const childBonus = children * 400;
  const threshold = monthlyNetIncome - childBonus;
  const adj = threshold / multiplier;

  if (adj <= 2500) return 3.5;
  if (adj <= 3500) return 2.5;
  if (adj <= 4500) return 1.5;
  if (adj <= 5500) return 0.75;
  return 0.25;
}

function getCapitalGrant(monthlyNetIncome, children, isCoupleOrFamily) {
  // €500–€10,000 based on income/household
  const multiplier = isCoupleOrFamily ? 1.35 : 1.0;
  const childBonus = children * 500;
  const adj = monthlyNetIncome / multiplier;

  let base;
  if (adj <= 2000) base = 10000;
  else if (adj <= 2800) base = 8000;
  else if (adj <= 3500) base = 6000;
  else if (adj <= 4500) base = 4000;
  else if (adj <= 6000) base = 2000;
  else if (adj <= 8000) base = 1000;
  else base = 500;

  return Math.min(10000, base + childBonus * 0.3);
}

function isEligibleStateGuarantee(annualNetIncome, isCouple) {
  const limit = isCouple ? 141049 : 101874;
  return annualNetIncome <= limit;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function SliderInput({ label, value, onChange, min, max, step, display }) {
  return (
    <div style={styles.fieldGroup}>
      <label style={styles.label}>
        {label}: <strong style={{ color: colors.navy }}>{display || fmt(value)}</strong>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: colors.gold, cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: colors.textLight, fontFamily: "sans-serif" }}>
        <span>{display ? `${min}` : fmt(min)}</span>
        <span>{display ? `${max}` : fmt(max)}</span>
      </div>
    </div>
  );
}

function BenefitRow({ icon, title, amount, eligible, reason, note }) {
  return (
    <div style={styles.benefitCard(eligible)}>
      <div style={styles.benefitIcon(eligible)}>{eligible ? "✓" : "✕"}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1rem" }}>{icon}</span>
          <strong style={{ fontSize: "0.92rem", color: eligible ? colors.teal : colors.textMid }}>{title}</strong>
          {eligible && amount && (
            <span style={styles.tag(colors.gold)}>{amount}</span>
          )}
          {!eligible && <span style={styles.tag(colors.red)}>Not Eligible</span>}
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: colors.textLight, fontFamily: "sans-serif", lineHeight: 1.5 }}>
          {eligible ? (note || reason) : reason}
        </p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, accent, small }) {
  return (
    <div style={styles.metricCard(accent)}>
      <div style={{ ...styles.metricValue, fontSize: small ? "1.4rem" : "1.9rem" }}>{value}</div>
      <div style={styles.metricLabel}>{label}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: colors.textMid, fontFamily: "sans-serif", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  // Profile
  const [household, setHousehold] = useState("couple"); // single | couple | family
  const [children, setChildren] = useState(2);
  const [monthlyNetIncome, setMonthlyNetIncome] = useState(7000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);

  // Property
  const [purchasePrice, setPurchasePrice] = useState(750000);
  const [propertyType, setPropertyType] = useState("apartment"); // apartment | terraced | semi | detached
  const [isNew, setIsNew] = useState(false);
  const [energyClass, setEnergyClass] = useState("C");

  // Financing
  const [ownFunds, setOwnFunds] = useState(100000);
  const [loanTermYears, setLoanTermYears] = useState(25);
  const [rateType, setRateType] = useState("fixed"); // fixed | variable | adjustable
  const [manualRate, setManualRate] = useState(3.77);
  const [scenarioCompare, setScenarioCompare] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("purchasePrice")) setPurchasePrice(Number(p.get("purchasePrice")));
    if (p.get("propertyType")) setPropertyType(p.get("propertyType"));
    if (p.get("energyClass")) setEnergyClass(p.get("energyClass"));
    if (p.get("isNew")) setIsNew(p.get("isNew") === "true");
  }, []);

  const tabs = ["Profile & Property", "Financing", "Benefits", "Results & Charts"];

  // ─── DERIVED CALCULATIONS ──────────────────────────────────────────────────
  const calc = useMemo(() => {
    const isCouple = household === "couple" || household === "family";
    const hasChildren = children > 0;
    const annualNet = monthlyNetIncome * 12;

    // Loan basics
    const loanAmount = purchasePrice - ownFunds;
    const loanAmountAdj = Math.max(0, loanAmount);

    // Registration fees (7%)
    const registrationFees = purchasePrice * 0.07;
    // Notary ~0.6% average
    const notaryFees = purchasePrice * 0.006;
    // Bank fees ~0.35%
    const bankFees = loanAmountAdj * 0.0035;
    // Total buying costs before aids
    const totalFees = registrationFees + notaryFees + bankFees;

    // Bëllegen Akt
    const bellegenPerPerson = 40000;
    const bellegenPersons = isCouple ? 2 : 1;
    const bellegenTotal = Math.min(bellegenPersons * bellegenPerPerson, registrationFees);
    const netRegistration = Math.max(0, registrationFees - bellegenTotal);

    // Capital grant
    const capitalGrant = getCapitalGrant(monthlyNetIncome, children, isCouple);
    // Property type bonus
    let grantMultiplier = 1;
    if (propertyType === "apartment" || propertyType === "terraced") grantMultiplier = 1.4;
    if (propertyType === "semi") grantMultiplier = 1.15;
    const capitalGrantFinal = Math.min(10000, capitalGrant * grantMultiplier);

    // Interest subsidy
    const subsidyRate = getInterestSubsidyRate(monthlyNetIncome, children, isCouple);
    const subsidisedBase = Math.min(loanAmountAdj, 200000 + children * 20000);
    const subsidisedCap = Math.min(subsidisedBase, 280000);

    // Effective rate after subsidy
    const baseRate = rateType === "fixed" ? 3.77 : rateType === "variable" ? 3.01 : 3.35;
    const effectiveRate = Math.max(0.5, baseRate - subsidyRate);
    const userRate = manualRate;
    const effectiveUserRate = Math.max(0.5, userRate - subsidyRate);

    // Monthly payments
    const monthlyGross = calcMonthlyPayment(loanAmountAdj, userRate, loanTermYears);
    const monthlyNet = calcMonthlyPayment(loanAmountAdj, effectiveUserRate, loanTermYears);

    // Affordability
    const dti = ((monthlyGross + monthlyDebts) / monthlyNetIncome) * 100;
    const dtiAfterAid = ((monthlyNet + monthlyDebts) / monthlyNetIncome) * 100;
    const affordable = dti <= 45;
    const comfortableAfterAid = dtiAfterAid <= 35;

    // State guarantee eligibility
    const stateGuaranteeEligible = isEligibleStateGuarantee(annualNet, isCouple);
    const maxGuarantee = Math.min(0.4 * purchasePrice, 303862);
    const ownFundsPct = (ownFunds / purchasePrice) * 100;

    // Monthly subsidy saving
    const monthlySaving = monthlyGross - monthlyNet;
    const annualSaving = monthlySaving * 12;

    // Super-reduced VAT (3%) for new builds - saves on VAT up to €50k home value portion
    const vatSaving = isNew ? 50000 * 0.17 : 0; // 3% vs 20% standard = 17% saving on up to €50k

    // Total savings summary
    const totalSavings = bellegenTotal + capitalGrantFinal + vatSaving;

    // Energy bonus
    const energyEligible = energyClass === "A" || energyClass === "B";

    // Net cost of purchase
    const netTotalCost = purchasePrice + totalFees - bellegenTotal - capitalGrantFinal - (isNew ? vatSaving : 0);

    // 30-year projection data
    const projectionData = [];
    for (let y = 1; y <= loanTermYears; y++) {
      const r = userRate / 100 / 12;
      const n = loanTermYears * 12;
      const months = y * 12;
      // Remaining balance
      const remaining = loanAmountAdj * (Math.pow(1 + r, n) - Math.pow(1 + r, months)) / (Math.pow(1 + r, n) - 1);
      const totalPaidGross = monthlyGross * months;
      const totalPaidNet = monthlyNet * months;
      const interestPaidGross = totalPaidGross - (loanAmountAdj - Math.max(0, remaining));
      projectionData.push({
        year: `Y${y}`,
        "Without Aid": Math.round(monthlyGross),
        "With Aid": Math.round(monthlyNet),
        "Remaining Balance": Math.round(Math.max(0, remaining)),
        "Cumulative Savings": Math.round((monthlyGross - monthlyNet) * months),
      });
    }

    // Scenario comparison
    const scenarios = [
      { name: "Fixed (3.77%)", rate: 3.77, monthly: calcMonthlyPayment(loanAmountAdj, Math.max(0.5, 3.77 - subsidyRate), loanTermYears) },
      { name: "Variable (3.01%)", rate: 3.01, monthly: calcMonthlyPayment(loanAmountAdj, Math.max(0.5, 3.01 - subsidyRate), loanTermYears) },
      { name: "Adjustable 5y (3.35%)", rate: 3.35, monthly: calcMonthlyPayment(loanAmountAdj, Math.max(0.5, 3.35 - subsidyRate), loanTermYears) },
    ];

    return {
      loanAmount: loanAmountAdj,
      registrationFees,
      notaryFees,
      bankFees,
      totalFees,
      bellegenTotal,
      netRegistration,
      capitalGrantFinal,
      subsidyRate,
      subsidisedCap,
      effectiveRate: effectiveUserRate,
      baseRate: userRate,
      monthlyGross,
      monthlyNet,
      dti,
      dtiAfterAid,
      affordable,
      comfortableAfterAid,
      stateGuaranteeEligible,
      maxGuarantee,
      ownFundsPct,
      monthlySaving,
      annualSaving,
      vatSaving,
      totalSavings,
      netTotalCost,
      isCouple,
      projectionData,
      scenarios,
      energyEligible,
      subsidisedCap,
      annualNet,
    };
  }, [household, children, monthlyNetIncome, monthlyDebts, purchasePrice, propertyType, isNew, energyClass, ownFunds, loanTermYears, rateType, manualRate]);

  // ─── TABS CONTENT ──────────────────────────────────────────────────────────
  const renderProfile = () => (
    <div>
      <h2 style={styles.sectionTitle}>👤 Household Profile</h2>
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Household Composition</div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Household Type</label>
            <select style={styles.select} value={household} onChange={e => setHousehold(e.target.value)}>
              <option value="single">Single Person</option>
              <option value="couple">Couple (no children)</option>
              <option value="family">Family (with children)</option>
            </select>
          </div>
          {(household === "family") && (
            <SliderInput label="Dependent Children" value={children} onChange={setChildren} min={1} max={6} step={1} display={`${children} child${children > 1 ? "ren" : ""}`} />
          )}
          <SliderInput label="Monthly Net Household Income" value={monthlyNetIncome} onChange={setMonthlyNetIncome} min={2000} max={20000} step={100} />
          <SliderInput label="Existing Monthly Debt Obligations" value={monthlyDebts} onChange={setMonthlyDebts} min={0} max={5000} step={50} />
          <div style={styles.infoBox}>
            💡 Income is your total household net income after taxes & social security. Include both partners if applicable. Maintenance payments you make are deducted automatically.
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Property Details</div>
          <SliderInput label="Purchase Price" value={purchasePrice} onChange={setPurchasePrice} min={200000} max={2000000} step={10000} />
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Property Type</label>
            <select style={styles.select} value={propertyType} onChange={e => setPropertyType(e.target.value)}>
              <option value="apartment">Apartment / Flat (commonhold)</option>
              <option value="terraced">Terraced House</option>
              <option value="semi">Semi-Detached House</option>
              <option value="detached">Detached House</option>
            </select>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Property Status</label>
            <select style={styles.select} value={isNew ? "new" : "existing"} onChange={e => setIsNew(e.target.value === "new")}>
              <option value="existing">Existing / Second-Hand</option>
              <option value="new">New Build / VEFA (off-plan)</option>
            </select>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Energy Class</label>
            <select style={styles.select} value={energyClass} onChange={e => setEnergyClass(e.target.value)}>
              {["A", "B", "C", "D", "E", "F", "G"].map(c => (
                <option key={c} value={c}>Class {c}{c === "A" ? " (Best)" : c === "G" ? " (Worst)" : ""}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancing = () => (
    <div>
      <h2 style={styles.sectionTitle}>🏦 Financing & Mortgage</h2>
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Loan Structure</div>
          <SliderInput label="Own Funds (Equity / Down Payment)" value={ownFunds} onChange={setOwnFunds} min={0} max={purchasePrice * 0.5} step={5000} />
          <div style={{ ...styles.infoBox, marginTop: "-4px" }}>
            Loan Amount: <strong>{fmt(calc.loanAmount)}</strong> ({(100 - calc.ownFundsPct).toFixed(1)}% LTV)
          </div>
          <SliderInput label="Mortgage Term" value={loanTermYears} onChange={setLoanTermYears} min={10} max={30} step={1} display={`${loanTermYears} years`} />
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Rate Type</label>
            <select style={styles.select} value={rateType} onChange={e => { setRateType(e.target.value); setManualRate(e.target.value === "fixed" ? 3.77 : e.target.value === "variable" ? 3.01 : 3.35); }}>
              <option value="fixed">Fixed Rate (stable for full term)</option>
              <option value="variable">Variable Rate (ECB-linked)</option>
              <option value="adjustable">Adjustable (fixed 3–10y, then revised)</option>
            </select>
          </div>
          <SliderInput label="Interest Rate" value={manualRate} onChange={setManualRate} min={1.0} max={7.0} step={0.05} display={`${manualRate.toFixed(2)}%`} />
          <div style={styles.infoBox}>
            📊 Current Luxembourg market rates (Apr 2026): <br />
            Fixed 30y ≈ <strong>3.77%</strong> · Variable ≈ <strong>3.01%</strong> · Adjustable 5y ≈ <strong>3.35%</strong>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Quick Affordability Check</div>
          <div style={{ ...styles.metricCard(calc.dti > 45 ? colors.red : calc.dti > 35 ? colors.gold : colors.teal), marginBottom: "14px" }}>
            <div style={{ ...styles.metricValue, color: calc.dti > 45 ? colors.red : calc.dti > 35 ? "#8B6914" : colors.teal }}>
              {calc.dti.toFixed(1)}%
            </div>
            <div style={styles.metricLabel}>Debt-to-Income Ratio (Gross)</div>
            <div style={{ fontSize: "0.78rem", fontFamily: "sans-serif", marginTop: "4px", color: colors.textMid }}>
              {calc.dti <= 35 ? "✅ Comfortable — well within bank limits" : calc.dti <= 45 ? "⚠️ Acceptable — banks may allow up to 45%" : "❌ Exceeds typical bank lending limits"}
            </div>
          </div>

          <div style={{ ...styles.metricCard(calc.dtiAfterAid <= 35 ? colors.teal : colors.gold), marginBottom: "14px" }}>
            <div style={{ ...styles.metricValue, fontSize: "1.5rem", color: colors.teal }}>
              {calc.dtiAfterAid.toFixed(1)}%
            </div>
            <div style={styles.metricLabel}>DTI After State Interest Subsidy</div>
          </div>

          <div style={styles.divider} />
          <div style={styles.cardTitle}>Rate Scenario Comparison</div>
          {calc.scenarios.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${colors.border}` : "none" }}>
              <span style={{ fontSize: "0.85rem", fontFamily: "sans-serif", color: colors.textMid }}>{s.name}</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "700", fontSize: "1rem", color: colors.navy }}>{fmt(s.monthly)}<span style={{ fontSize: "0.72rem", fontWeight: "400" }}>/mo</span></div>
                <div style={{ fontSize: "0.7rem", color: colors.teal, fontFamily: "sans-serif" }}>After {calc.subsidyRate}% subsidy</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBenefits = () => (
    <div>
      <h2 style={styles.sectionTitle}>🏛️ Government Benefits & Eligibility</h2>
      <div style={styles.infoBox}>
        All benefits are assessed based on your household profile. Eligibility requires: legal age, Luxembourg residency rights (3+ months), property as primary residence, and not owning another property in Luxembourg or abroad.
      </div>

      <BenefitRow
        icon="🏷️"
        title="Bëllegen Akt — Registration Duty Credit"
        eligible={true}
        amount={fmt(calc.bellegenTotal) + " saving"}
        note={`€40,000 per person × ${calc.isCouple ? "2 persons" : "1 person"} = ${fmt(calc.bellegenTotal)} off your ${fmt(calc.registrationFees)} registration fee. Net fee payable: ${fmt(calc.netRegistration)}. This benefit is permanent (2026).`}
      />
      <BenefitRow
        icon="💰"
        title="Capital Grant (Prime d'Accession à la Propriété)"
        eligible={true}
        amount={fmt(calc.capitalGrantFinal) + " one-time"}
        note={`Based on your income and household composition. ${propertyType === "apartment" || propertyType === "terraced" ? "Increased by 40% for apartment/terraced house." : propertyType === "semi" ? "Increased by 15% for semi-detached." : ""} Applied via Ministry of Housing (guichet.lu).`}
      />
      <BenefitRow
        icon="📉"
        title="Interest Subsidy (Subvention d'Intérêt)"
        eligible={true}
        amount={`${calc.subsidyRate}% rate reduction`}
        note={`Subsidy of ${calc.subsidyRate}% applied on up to ${fmt(calc.subsidisedCap)} of your loan. Reduces effective rate from ${calc.baseRate.toFixed(2)}% to ${calc.effectiveRate.toFixed(2)}%. Monthly saving: ${fmt(calc.monthlySaving)} → ${fmt(calc.annualSaving)}/year.`}
      />
      <BenefitRow
        icon="🔒"
        title="State Loan Guarantee (Garantie de l'État)"
        eligible={calc.stateGuaranteeEligible}
        amount={calc.stateGuaranteeEligible ? `Up to ${fmt(calc.maxGuarantee)}` : undefined}
        reason={calc.stateGuaranteeEligible
          ? `Your annual income of ${fmt(calc.annualNet)} is within the ${calc.isCouple ? "€141,049 (couple)" : "€101,874 (single)"} threshold. The guarantee covers up to 40% of project cost, capped at €303,862. Useful if own funds are limited.`
          : `Annual household income (${fmt(calc.annualNet)}) exceeds the ${calc.isCouple ? "€141,049 (couple)" : "€101,874 (single)"} threshold for this benefit.`}
      />
      <BenefitRow
        icon="⚡"
        title="Super-Reduced 3% VAT (New Builds)"
        eligible={isNew}
        amount={isNew ? fmt(calc.vatSaving) + " saving" : undefined}
        reason={isNew
          ? `New build qualifies for 3% VAT rate (vs 17% standard) on up to €50,000 of home value. Estimated saving: ${fmt(calc.vatSaving)}.`
          : "Applies only to new builds or VEFA (off-plan) purchases. Your property is listed as existing."}
      />
      <BenefitRow
        icon="🔋"
        title="Energy Efficiency Bonus (Klimabonus / State Guarantee)"
        eligible={calc.energyEligible}
        amount={calc.energyEligible ? "Up to €100,000 loan guarantee" : undefined}
        reason={calc.energyEligible
          ? `Class ${energyClass} property qualifies for state energy loan guarantee (up to €50,000, 15 years) and interest subsidy on energy loans up to €100,000.`
          : `Energy class ${energyClass} does not qualify for premium energy benefits. Consider renovation to reach class A or B.`}
      />

      <div style={{ ...styles.card, marginTop: "24px", background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyMid} 100%)` }}>
        <div style={{ ...styles.cardTitle, color: colors.goldLight }}>📊 Total Benefits Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: "700", color: colors.goldLight }}>{fmt(calc.bellegenTotal + calc.capitalGrantFinal + (isNew ? calc.vatSaving : 0))}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "4px" }}>One-Time Savings</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: "700", color: colors.tealLight }}>{fmt(calc.annualSaving)}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "4px" }}>Annual Interest Saving</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: "700", color: "#7FC8BD" }}>{fmt(calc.annualSaving * loanTermYears)}</div>
            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: "4px" }}>Lifetime Interest Saving</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div>
      <h2 style={styles.sectionTitle}>📊 Full Results & Projections</h2>

      {/* Key Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px", marginBottom: "24px" }}>
        <MetricCard label="Monthly Payment (Gross)" value={fmt(calc.monthlyGross)} sub={`At ${calc.baseRate.toFixed(2)}% before subsidy`} accent={colors.red} />
        <MetricCard label="Monthly Payment (Net)" value={fmt(calc.monthlyNet)} sub={`At ${calc.effectiveRate.toFixed(2)}% after ${calc.subsidyRate}% subsidy`} accent={colors.teal} />
        <MetricCard label="Monthly Saving" value={fmt(calc.monthlySaving)} sub="From interest subsidy alone" accent={colors.gold} />
        <MetricCard label="Net Purchase Cost" value={fmt(calc.netTotalCost)} sub="After all one-time benefits" accent={colors.navyLight} />
      </div>

      {/* Cost Breakdown */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Full Cost Breakdown</div>
          {[
            ["Purchase Price", purchasePrice, colors.navy],
            ["Registration Fees (7%)", calc.registrationFees, colors.red],
            ["Notary Fees (~0.6%)", calc.notaryFees, "#8B4513"],
            ["Bank / Arrangement Fees", calc.bankFees, "#8B6914"],
            ["─── Less Benefits ───", null, colors.textLight],
            ["Bëllegen Akt Credit", -calc.bellegenTotal, colors.teal],
            ["Capital Grant", -calc.capitalGrantFinal, colors.teal],
            isNew ? ["VAT Saving (New Build)", -calc.vatSaving, colors.teal] : null,
          ].filter(Boolean).map(([label, value, color], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${colors.border}`, fontFamily: "sans-serif", fontSize: "0.85rem" }}>
              <span style={{ color: value === null ? colors.textLight : colors.textMid }}>{label}</span>
              {value !== null && <strong style={{ color }}>{value < 0 ? "−" + fmt(-value) : fmt(value)}</strong>}
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontFamily: "sans-serif", fontSize: "1rem", fontWeight: "700" }}>
            <span style={{ color: colors.navy }}>Net Total Cost</span>
            <strong style={{ color: colors.navy }}>{fmt(calc.netTotalCost)}</strong>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Loan Repayment Summary</div>
          {[
            ["Loan Amount", fmt(calc.loanAmount)],
            ["Mortgage Term", `${loanTermYears} years`],
            ["Base Interest Rate", fmtPct(calc.baseRate)],
            ["Interest Subsidy", `−${fmtPct(calc.subsidyRate)}`],
            ["Effective Rate", fmtPct(calc.effectiveRate)],
            ["Monthly Payment", fmt(calc.monthlyNet)],
            ["Total Interest Paid", fmt(calc.monthlyNet * loanTermYears * 12 - calc.loanAmount)],
            ["Total Repaid", fmt(calc.monthlyNet * loanTermYears * 12)],
            ["Lifetime Subsidy Saving", fmt(calc.monthlySaving * loanTermYears * 12)],
          ].map(([label, value], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${colors.border}`, fontFamily: "sans-serif", fontSize: "0.85rem" }}>
              <span style={{ color: colors.textMid }}>{label}</span>
              <strong style={{ color: colors.navy }}>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{ ...styles.card, marginTop: "20px" }}>
        <div style={styles.cardTitle}>Monthly Payment: With vs Without State Subsidy</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={calc.projectionData.filter((_, i) => i % 3 === 0 || i === 0 || i === calc.projectionData.length - 1)} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: "sans-serif" }} />
            <YAxis tickFormatter={(v) => "€" + (v / 1000).toFixed(0) + "k"} tick={{ fontSize: 11, fontFamily: "sans-serif" }} />
            <Tooltip formatter={(v) => fmt(v)} />
            <Legend />
            <Bar dataKey="Without Aid" fill={colors.red} opacity={0.75} radius={[4, 4, 0, 0]} />
            <Bar dataKey="With Aid" fill={colors.teal} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...styles.card, marginTop: "20px" }}>
        <div style={styles.cardTitle}>Cumulative Savings from Interest Subsidy Over Loan Term</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={calc.projectionData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="year" tick={{ fontSize: 10, fontFamily: "sans-serif" }} interval={Math.floor(loanTermYears / 6)} />
            <YAxis tickFormatter={(v) => "€" + (v / 1000).toFixed(0) + "k"} tick={{ fontSize: 11, fontFamily: "sans-serif" }} />
            <Tooltip formatter={(v) => fmt(v)} />
            <Legend />
            <Line dataKey="Cumulative Savings" stroke={colors.gold} strokeWidth={2.5} dot={false} />
            <Line dataKey="Remaining Balance" stroke={colors.navyLight} strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Affordability Verdict */}
      <div style={{ ...styles.card, marginTop: "20px", borderTop: `4px solid ${calc.comfortableAfterAid ? colors.teal : colors.gold}` }}>
        <div style={styles.cardTitle}>Affordability Verdict</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", fontFamily: "sans-serif" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: colors.textLight, marginBottom: "4px" }}>Monthly Payment After Aid</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "700", color: colors.teal }}>{fmt(calc.monthlyNet)}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: colors.textLight, marginBottom: "4px" }}>Remaining Income After Housing + Debts</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "700", color: colors.navy }}>{fmt(monthlyNetIncome - calc.monthlyNet - monthlyDebts)}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", color: colors.textLight, marginBottom: "4px" }}>Bank Eligibility (35–45% DTI Rule)</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "700", color: calc.dti <= 45 ? colors.teal : colors.red }}>
              {calc.dti <= 35 ? "✅ Comfortably Eligible" : calc.dti <= 45 ? "⚠️ Eligible (Higher DTI)" : "❌ May Face Challenges"}
            </div>
          </div>
        </div>
        <div style={{ ...styles.infoBox, marginTop: "16px", marginBottom: 0 }}>
          💡 <strong>Tip:</strong> Luxembourg banks typically allow up to 35% DTI for standard approvals, and up to 40–45% for higher incomes or stable civil servant contracts. The state interest subsidy is a key lever — it reduces your effective monthly cost significantly. Combined with the Bëllegen Akt saving of {fmt(calc.bellegenTotal)}, your total upfront benefit package is {fmt(calc.bellegenTotal + calc.capitalGrantFinal + (isNew ? calc.vatSaving : 0))}.
        </div>
      </div>
    </div>
  );

  const tabContent = [renderProfile, renderFinancing, renderBenefits, renderResults];

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={styles.badge}>Luxembourg · 2026</div>
          <h1 style={styles.headerTitle}>Home Buyer Simulator</h1>
          <p style={styles.headerSub}>Government Benefits · Mortgage Calculator · Affordability Analysis</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", width: "100%" }}>
          {tabs.map((t, i) => (
            <button key={i} style={styles.tab(activeTab === i)} onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {tabContent[activeTab]()}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", gap: "12px" }}>
          <button style={styles.btnSecondary} onClick={() => setActiveTab(Math.max(0, activeTab - 1))} disabled={activeTab === 0}>
            ← Previous
          </button>
          <div style={{ fontSize: "0.8rem", fontFamily: "sans-serif", color: colors.textLight, alignSelf: "center" }}>
            Step {activeTab + 1} of {tabs.length}
          </div>
          {activeTab < tabs.length - 1 ? (
            <button style={styles.btn} onClick={() => setActiveTab(activeTab + 1)}>
              {activeTab === tabs.length - 2 ? "View Results →" : "Next →"}
            </button>
          ) : (
            <button style={styles.btn} onClick={() => setActiveTab(0)}>↺ Start Over</button>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "40px", padding: "20px", background: colors.navyMid, borderRadius: "10px", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "0.72rem", fontFamily: "sans-serif", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            This simulator is for informational purposes only. Benefit amounts and thresholds are based on Luxembourg government data (guichet.lu, logement.lu) as of 2025–2026. Always verify eligibility with the Guichet Unique des Aides au Logement (11, rue de Hollerich, L-1741 Luxembourg) and your bank before making financial decisions. Interest rates are indicative based on BCL/market data as of April 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
