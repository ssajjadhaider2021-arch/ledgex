import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { submitRiskAssessment } from "../../api/onboarding.api";
import { OnboardingStepsProgress } from "../../components/onboarding/OnboardingStepsProgress";
import {
  OnboardingSuccessOverlay,
  InlineSubmitSpinner,
} from "../../components/onboarding/OnboardingSuccessOverlay";

const SUCCESS_HOLD_MS = 900;

/** Enum `value` → UI `label` (Step 1: Business Activity) */
const BUSINESS_TYPE_OPTIONS = [
  { value: "LIMITED_COMPANY", label: "Limited company" },
  { value: "SOLE_TRADER", label: "Sole trader" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "LLP", label: "LLP" },
  { value: "CHARITY", label: "Charity / non-profit" },
  { value: "OTHER", label: "Other" },
];

const BUSINESS_LOCATION_OPTIONS = [
  { value: "UK", label: "United Kingdom" },
  { value: "EU", label: "European Union" },
  { value: "US", label: "United States" },
  { value: "GLOBAL", label: "Multiple / global" },
  { value: "OTHER", label: "Other" },
];

const BUSINESS_AGE_OPTIONS = [
  { value: "ZERO_TO_ONE", label: "0–1 years" },
  { value: "ONE_TO_THREE", label: "1–3 years" },
  { value: "THREE_TO_FIVE", label: "3–5 years" },
  { value: "FIVE_TO_TEN", label: "5–10 years" },
  { value: "TEN_PLUS", label: "10+ years" },
];

/** Step 2: Source of Funds — enum value → label */
const INCOME_SOURCE_OPTIONS = [
  { value: "OPERATING_REVENUE", label: "Operating revenue" },
  { value: "INVESTMENTS_DIVIDENDS", label: "Investments / dividends" },
  { value: "LOAN_CREDIT", label: "Loan or credit facility" },
  { value: "CAPITAL_INJECTION", label: "Owner capital injection" },
  { value: "MIXED", label: "Mixed sources" },
  { value: "OTHER", label: "Other" },
];

const WEALTH_ORIGIN_OPTIONS = [
  { value: "EMPLOYMENT", label: "Employment / career earnings" },
  { value: "PRIOR_BUSINESS_SALE", label: "Prior business sale" },
  { value: "INHERITANCE_GIFT", label: "Inheritance / gift" },
  { value: "INVESTMENT_RETURNS", label: "Investment returns" },
  { value: "OTHER", label: "Other" },
];

const PROOF_OF_FUNDS_YES_NO = [
  { value: true, label: "Yes" },
  { value: false, label: "No" },
];

const INITIAL = {
  businessActivity: {
    businessType: "",
    businessLocation: "",
    businessAge: "",
  },
  sourceOfFunds: {
    incomeSource: "",
    hasProofOfFunds: null,
    wealthOrigin: "",
  },
  transactionVolume: {
    turnover: "",
    frequency: "",
    largeTransactions: "",
    cashPercentage: "",
  },
  pepCompliance: {
    isPep: null,
    isPepAssociate: null,
    hasSanctions: null,
    hasAdverseMedia: null,
  },
};

const STEPS = [
  {
    id: 0,
    short: "Activity",
    title: "Business Activity",
    subtitle: "We use this to tailor compliance checks to your profile.",
    group: "businessActivity",
    fields: [
      {
        name: "businessType",
        label: "Business type",
        options: BUSINESS_TYPE_OPTIONS,
      },
      {
        name: "businessLocation",
        label: "Business location",
        options: BUSINESS_LOCATION_OPTIONS,
      },
      {
        name: "businessAge",
        label: "Business age",
        options: BUSINESS_AGE_OPTIONS,
      },
    ],
  },
  {
    id: 1,
    short: "Funds",
    title: "Source of Funds",
    subtitle: "Helps us understand how capital enters your business.",
    group: "sourceOfFunds",
    fields: [
      {
        name: "incomeSource",
        label: "Primary income source",
        options: INCOME_SOURCE_OPTIONS,
      },
      {
        name: "hasProofOfFunds",
        label: "Proof of funds",
        hint: "Can you provide supporting documents for major inflows?",
        kind: "boolean",
      },
      {
        name: "wealthOrigin",
        label: "Wealth origin",
        options: WEALTH_ORIGIN_OPTIONS,
      },
    ],
  },
  {
    id: 2,
    short: "Volume",
    title: "Transaction Volume",
    subtitle: "Expected patterns help us calibrate monitoring.",
    group: "transactionVolume",
    fields: [
      {
        name: "turnover",
        label: "Annual turnover (approx.)",
        options: [
          { value: "under_50k", label: "Under £50k" },
          { value: "50k_250k", label: "£50k – £250k" },
          { value: "250k_1m", label: "£250k – £1m" },
          { value: "1m_5m", label: "£1m – £5m" },
          { value: "over_5m", label: "Over £5m" },
        ],
      },
      {
        name: "frequency",
        label: "Transaction frequency",
        options: [
          { value: "low", label: "Low — a few per month" },
          { value: "medium", label: "Medium — weekly" },
          { value: "high", label: "High — daily or more" },
        ],
      },
      {
        name: "largeTransactions",
        label: "Large transactions",
        hint: "Do you expect individual transactions over £10,000?",
        options: [
          { value: "rarely", label: "Rarely" },
          { value: "occasionally", label: "Occasionally" },
          { value: "frequently", label: "Frequently" },
        ],
      },
      {
        name: "cashPercentage",
        label: "Cash as % of revenue",
        options: [
          { value: "0-10", label: "0–10%" },
          { value: "10-25", label: "10–25%" },
          { value: "25-50", label: "25–50%" },
          { value: "50+", label: "Over 50%" },
        ],
      },
    ],
  },
  {
    id: 3,
    short: "PEP",
    title: "PEP & Compliance",
    subtitle: "Regulated firms must record these declarations accurately.",
    group: "pepCompliance",
    fields: [
      {
        name: "isPep",
        label: "Politically exposed person (PEP)",
        hint: "Are you personally classified as a politically exposed person?",
        kind: "boolean",
      },
      {
        name: "isPepAssociate",
        label: "PEP associate",
        hint: "Are you a close associate or family member of a PEP?",
        kind: "boolean",
      },
      {
        name: "hasSanctions",
        label: "Sanctions exposure",
        hint: "Any matches or exposure to sanctions lists?",
        kind: "boolean",
      },
      {
        name: "hasAdverseMedia",
        label: "Adverse media",
        hint: "Any known adverse media concerning you or your business?",
        kind: "boolean",
      },
    ],
  },
];

function validateStep(stepIndex, data) {
  const step = STEPS[stepIndex];
  const errs = {};
  const slice = data[step.group];
  for (const f of step.fields) {
    if (f.kind === "boolean") {
      const b = slice[f.name];
      if (b !== true && b !== false) {
        errs[f.name] = "Please choose an option.";
      }
      continue;
    }
    const v = slice[f.name];
    if (v === undefined || v === null || !String(v).trim()) {
      errs[f.name] = "Please choose an option.";
    }
  }
  return errs;
}

function ActivityRadioGroup({ id, label, hint, value, onChange, options, error, disabled, name }) {
  const legendId = `${id}-legend`;
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 sm:p-6">
      <p id={legendId} className="text-sm font-semibold text-slate-900">
        {label}
      </p>
      {hint ? <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p> : null}
      <div
        role="radiogroup"
        aria-labelledby={legendId}
        className="mt-4 space-y-2.5"
      >
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <label
              key={`${name}-${String(o.value)}`}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-sm leading-snug transition-all duration-200 ${
                selected
                  ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50/90 text-slate-900 shadow-md shadow-blue-600/10 ring-2 ring-blue-500/35"
                  : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50/90"
              } ${disabled ? "pointer-events-none opacity-50" : ""}`}
            >
              <input
                type="radio"
                name={name}
                value={typeof o.value === "boolean" ? String(o.value) : o.value}
                checked={selected}
                onChange={() => !disabled && onChange(o.value)}
                disabled={disabled}
                className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex-1">{o.label}</span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden>
                {selected ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({ id, label, hint, value, onChange, options, error, disabled }) {
  const filled = Boolean(value?.trim?.());
  return (
    <div
      className={`space-y-1.5 rounded-2xl border p-4 transition-all duration-200 sm:p-5 ${
        filled
          ? "border-blue-200 bg-gradient-to-br from-blue-50/80 to-white shadow-sm ring-1 ring-blue-500/15"
          : "border-slate-100 bg-white"
      }`}
    >
      <label htmlFor={id} className="block text-sm font-semibold text-slate-900">
        {label}
      </label>
      {hint ? <p className="text-xs leading-relaxed text-slate-500">{hint}</p> : null}
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60 ${
            error ? "border-red-300 focus:border-red-500" : filled ? "border-blue-300 focus:border-blue-500" : "border-slate-200 focus:border-blue-500"
          }`}
        >
          <option value="">Select an option…</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function OnboardingStep3Page() {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState(INITIAL);
  const [businessType, setBusinessType] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");
  const [businessAge, setBusinessAge] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  /** null = not chosen yet; stores boolean true/false in data when set */
  const [hasProofOfFunds, setHasProofOfFunds] = useState(null);
  const [wealthOrigin, setWealthOrigin] = useState("");
  const [isPep, setIsPep] = useState(null);
  const [isPepAssociate, setIsPepAssociate] = useState(null);
  const [hasSanctions, setHasSanctions] = useState(null);
  const [hasAdverseMedia, setHasAdverseMedia] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "client") {
      navigate("/dashboard", { replace: true });
      return;
    }
    if (user.onboardingStep < 3) {
      navigate("/onboarding/step2", { replace: true });
      return;
    }
    if (user.onboardingCompleted) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const stepDef = STEPS[activeStep];
  const progressPct = useMemo(() => ((activeStep + 1) / STEPS.length) * 100, [activeStep]);

  const step1Complete =
    Boolean(businessType?.trim()) && Boolean(businessLocation?.trim()) && Boolean(businessAge?.trim());

  const step2Complete =
    Boolean(incomeSource?.trim()) &&
    (hasProofOfFunds === true || hasProofOfFunds === false) &&
    Boolean(wealthOrigin?.trim());

  const step3Complete = useMemo(() => {
    const tv = data.transactionVolume;
    return (
      Boolean(tv.turnover?.trim?.()) &&
      Boolean(tv.frequency?.trim?.()) &&
      Boolean(tv.largeTransactions?.trim?.()) &&
      Boolean(tv.cashPercentage?.trim?.())
    );
  }, [data.transactionVolume]);

  const step4Complete =
    (isPep === true || isPep === false) &&
    (isPepAssociate === true || isPepAssociate === false) &&
    (hasSanctions === true || hasSanctions === false) &&
    (hasAdverseMedia === true || hasAdverseMedia === false);

  const currentStepComplete = useMemo(() => {
    switch (activeStep) {
      case 0:
        return step1Complete;
      case 1:
        return step2Complete;
      case 2:
        return step3Complete;
      case 3:
        return step4Complete;
      default:
        return false;
    }
  }, [activeStep, step1Complete, step2Complete, step3Complete, step4Complete]);

  useEffect(() => {
    if (activeStep !== 0) return;
    const ba = data.businessActivity;
    setBusinessType(ba.businessType || "");
    setBusinessLocation(ba.businessLocation || "");
    setBusinessAge(ba.businessAge || "");
  }, [activeStep]);

  useEffect(() => {
    if (activeStep !== 1) return;
    const sf = data.sourceOfFunds;
    setIncomeSource(sf.incomeSource || "");
    const p = sf.hasProofOfFunds;
    setHasProofOfFunds(p === true || p === false ? p : null);
    setWealthOrigin(sf.wealthOrigin || "");
  }, [activeStep]);

  useEffect(() => {
    if (activeStep !== 3) return;
    const pc = data.pepCompliance;
    const b = (v) => (v === true || v === false ? v : null);
    setIsPep(b(pc.isPep));
    setIsPepAssociate(b(pc.isPepAssociate));
    setHasSanctions(b(pc.hasSanctions));
    setHasAdverseMedia(b(pc.hasAdverseMedia));
  }, [activeStep]);

  const setBusinessTypeEnum = useCallback((v) => {
    setBusinessType(v);
    setData((prev) => ({
      ...prev,
      businessActivity: { ...prev.businessActivity, businessType: v },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.businessType;
      return next;
    });
    setFormError("");
  }, []);

  const setBusinessLocationEnum = useCallback((v) => {
    setBusinessLocation(v);
    setData((prev) => ({
      ...prev,
      businessActivity: { ...prev.businessActivity, businessLocation: v },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.businessLocation;
      return next;
    });
    setFormError("");
  }, []);

  const setBusinessAgeEnum = useCallback((v) => {
    setBusinessAge(v);
    setData((prev) => ({
      ...prev,
      businessActivity: { ...prev.businessActivity, businessAge: v },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.businessAge;
      return next;
    });
    setFormError("");
  }, []);

  const setIncomeSourceEnum = useCallback((v) => {
    setIncomeSource(v);
    setData((prev) => ({
      ...prev,
      sourceOfFunds: { ...prev.sourceOfFunds, incomeSource: v },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.incomeSource;
      return next;
    });
    setFormError("");
  }, []);

  const setHasProofOfFundsBool = useCallback((v) => {
    setHasProofOfFunds(v);
    setData((prev) => ({
      ...prev,
      sourceOfFunds: { ...prev.sourceOfFunds, hasProofOfFunds: v },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.hasProofOfFunds;
      return next;
    });
    setFormError("");
  }, []);

  const setWealthOriginEnum = useCallback((v) => {
    setWealthOrigin(v);
    setData((prev) => ({
      ...prev,
      sourceOfFunds: { ...prev.sourceOfFunds, wealthOrigin: v },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.wealthOrigin;
      return next;
    });
    setFormError("");
  }, []);

  const setPepBool = useCallback((field, setter, value) => {
    setter(value);
    setData((prev) => ({
      ...prev,
      pepCompliance: { ...prev.pepCompliance, [field]: value },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setFormError("");
  }, []);

  const updateField = useCallback((group, name, value) => {
    setData((prev) => ({
      ...prev,
      [group]: { ...prev[group], [name]: value },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setFormError("");
  }, []);

  const goPrevious = () => {
    setFormError("");
    setFieldErrors({});
    setActiveStep((s) => Math.max(0, s - 1));
  };

  const buildSnapshotData = useCallback(() => {
    let next = { ...data };
    if (activeStep === 0) {
      next = {
        ...next,
        businessActivity: { businessType, businessLocation, businessAge },
      };
    } else if (activeStep === 1) {
      next = {
        ...next,
        sourceOfFunds: {
          ...next.sourceOfFunds,
          incomeSource,
          hasProofOfFunds,
          wealthOrigin,
        },
      };
    } else if (activeStep === 3) {
      next = {
        ...next,
        pepCompliance: {
          isPep,
          isPepAssociate,
          hasSanctions,
          hasAdverseMedia,
        },
      };
    }
    return next;
  }, [
    activeStep,
    data,
    businessType,
    businessLocation,
    businessAge,
    incomeSource,
    hasProofOfFunds,
    wealthOrigin,
    isPep,
    isPepAssociate,
    hasSanctions,
    hasAdverseMedia,
  ]);

  const buildRiskAssessmentPayload = useCallback(() => {
    const ba = { businessType, businessLocation, businessAge };
    const sf = {
      incomeSource,
      hasProofOfFunds,
      wealthOrigin,
    };
    const tv = data.transactionVolume;
    return {
      businessType: ba.businessType,
      businessLocation: ba.businessLocation,
      businessAge: ba.businessAge,
      incomeSource: sf.incomeSource,
      hasProofOfFunds: sf.hasProofOfFunds,
      wealthOrigin: sf.wealthOrigin,
      annualTurnover: tv.turnover,
      transactionFrequency: tv.frequency,
      highValueTransactions: tv.largeTransactions,
      cashPercentage: tv.cashPercentage,
      isPep,
      isPepAssociate,
      hasSanctions,
      hasAdverseMedia,
    };
  }, [
    businessType,
    businessLocation,
    businessAge,
    incomeSource,
    hasProofOfFunds,
    wealthOrigin,
    data.transactionVolume,
    isPep,
    isPepAssociate,
    hasSanctions,
    hasAdverseMedia,
  ]);

  const goNext = async () => {
    setFormError("");
    const snapshot = buildSnapshotData();
    const errs = validateStep(activeStep, snapshot);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    if (activeStep < STEPS.length - 1) {
      setData(snapshot);
      setActiveStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    try {
      await submitRiskAssessment(buildRiskAssessmentPayload());
      await loadUser();
      setSubmitting(false);
      setShowSuccess(true);
      await new Promise((r) => setTimeout(r, SUCCESS_HOLD_MS));
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;
  if (user.role !== "client") return <Navigate to="/dashboard" replace />;
  if (user.onboardingCompleted) return <Navigate to="/dashboard" replace />;

  const busy = submitting || showSuccess;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-28 text-slate-900">
      <OnboardingSuccessOverlay
        visible={showSuccess}
        message="Onboarding complete"
        subMessage="Opening your dashboard…"
      />
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-2 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600/90">Ledgex</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Step 3: Risk &amp; compliance
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Four short sections. You can go back to change answers before submitting.
          </p>
        </header>

        <OnboardingStepsProgress activeStep={3} />

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/[0.06] ring-1 ring-slate-900/5">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Risk questionnaire</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                  Step {activeStep + 1} of {STEPS.length}
                </p>
              </div>
              <p className="text-xs font-medium tabular-nums text-slate-500">{Math.round(progressPct)}% complete</p>
            </div>

            <div className="flex gap-1.5" role="presentation">
              {STEPS.map((s, i) => {
                const done = i < activeStep;
                const current = i === activeStep;
                return (
                  <div key={s.id} className="min-w-0 flex-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        done ? "bg-blue-600" : current ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/25" : "bg-slate-100"
                      }`}
                      aria-hidden
                    />
                  </div>
                );
              })}
            </div>

            <nav className="mt-3 grid grid-cols-4 gap-1 sm:gap-2" aria-label="Questionnaire steps">
              {STEPS.map((s, i) => {
                const done = i < activeStep;
                const current = i === activeStep;
                const clickable = i < activeStep && !busy;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={!clickable}
                    onClick={() => {
                      if (!clickable) return;
                      setFieldErrors({});
                      setFormError("");
                      setActiveStep(i);
                    }}
                    title={done ? `Back to ${s.title}` : current ? `Current: ${s.title}` : ""}
                    className={`rounded-lg px-1 py-2 text-center transition ${
                      clickable ? "cursor-pointer hover:bg-slate-50" : "cursor-default"
                    }`}
                  >
                    <span
                      className={`block truncate text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${
                        current ? "text-blue-700" : done ? "text-slate-700" : "text-slate-300"
                      }`}
                    >
                      {i + 1}. {s.short}
                    </span>
                    <span
                      className={`mt-0.5 hidden truncate text-[10px] leading-tight sm:block ${
                        current ? "font-medium text-slate-700" : done ? "text-slate-500" : "text-slate-300"
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div key={activeStep} className="onboarding-step-panel px-5 py-6 sm:px-8 sm:py-8">
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/90 to-white px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600/90">
                Step {activeStep + 1} — {stepDef.short}
              </p>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{stepDef.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{stepDef.subtitle}</p>
            </div>

            <div className="mt-6 space-y-4">
              <section
                className="rounded-xl border border-amber-200 bg-amber-50/95 px-4 py-4 shadow-sm sm:px-5 sm:py-5"
                aria-labelledby="step3-identity-verification-title"
              >
                <h3
                  id="step3-identity-verification-title"
                  className="text-sm font-semibold text-amber-950"
                >
                  Identity Verification Required
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-950/90">
                  To comply with AML regulations and provide you with accounting services, we need to verify your
                  identity and business information. Please upload the required documents below. All documents must be
                  clear, legible, and dated within the specified timeframes.
                </p>
              </section>

              <section
                className="rounded-xl border border-blue-200 bg-blue-50/90 px-4 py-4 shadow-sm sm:px-5 sm:py-5"
                aria-labelledby="step3-risk-intro-title"
              >
                <h3 id="step3-risk-intro-title" className="text-sm font-semibold text-blue-950">
                  Risk Assessment
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-800">
                  Please complete this risk assessment questionnaire to help us understand your business activities and
                  comply with AML regulations.
                </p>
              </section>
            </div>

            {formError ? (
              <div
                className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {formError}
              </div>
            ) : null}

            <div className="mt-6 space-y-6">
              {activeStep === 0 ? (
                <div className="space-y-6">
                  <ActivityRadioGroup
                    id="step3-business-type"
                    name="businessType"
                    label="Business type"
                    value={businessType}
                    onChange={setBusinessTypeEnum}
                    options={BUSINESS_TYPE_OPTIONS}
                    error={fieldErrors.businessType}
                    disabled={busy}
                  />
                  <ActivityRadioGroup
                    id="step3-business-location"
                    name="businessLocation"
                    label="Business location"
                    value={businessLocation}
                    onChange={setBusinessLocationEnum}
                    options={BUSINESS_LOCATION_OPTIONS}
                    error={fieldErrors.businessLocation}
                    disabled={busy}
                  />
                  <ActivityRadioGroup
                    id="step3-business-age"
                    name="businessAge"
                    label="Business age"
                    value={businessAge}
                    onChange={setBusinessAgeEnum}
                    options={BUSINESS_AGE_OPTIONS}
                    error={fieldErrors.businessAge}
                    disabled={busy}
                  />
                </div>
              ) : activeStep === 1 ? (
                <div className="space-y-6">
                  <ActivityRadioGroup
                    id="step3-income-source"
                    name="incomeSource"
                    label="Primary income source"
                    value={incomeSource}
                    onChange={setIncomeSourceEnum}
                    options={INCOME_SOURCE_OPTIONS}
                    error={fieldErrors.incomeSource}
                    disabled={busy}
                  />
                  <ActivityRadioGroup
                    id="step3-proof-of-funds"
                    name="hasProofOfFunds"
                    label="Proof of funds"
                    hint="Can you provide supporting documents for major inflows?"
                    value={hasProofOfFunds}
                    onChange={setHasProofOfFundsBool}
                    options={PROOF_OF_FUNDS_YES_NO}
                    error={fieldErrors.hasProofOfFunds}
                    disabled={busy}
                  />
                  <ActivityRadioGroup
                    id="step3-wealth-origin"
                    name="wealthOrigin"
                    label="Wealth origin"
                    value={wealthOrigin}
                    onChange={setWealthOriginEnum}
                    options={WEALTH_ORIGIN_OPTIONS}
                    error={fieldErrors.wealthOrigin}
                    disabled={busy}
                  />
                </div>
              ) : activeStep === 2 ? (
                STEPS[2].fields.map((f) => {
                  const gid = `transactionVolume-${f.name}`;
                  return (
                    <SelectField
                      key={f.name}
                      id={gid}
                      label={f.label}
                      hint={f.hint}
                      value={data.transactionVolume[f.name]}
                      onChange={(v) => updateField("transactionVolume", f.name, v)}
                      options={f.options}
                      error={fieldErrors[f.name]}
                      disabled={busy}
                    />
                  );
                })
              ) : activeStep === 3 ? (
                <div className="space-y-6">
                  <ActivityRadioGroup
                    id="step3-is-pep"
                    name="isPep"
                    label="Politically exposed person (PEP)"
                    hint="Are you personally classified as a politically exposed person?"
                    value={isPep}
                    onChange={(v) => setPepBool("isPep", setIsPep, v)}
                    options={PROOF_OF_FUNDS_YES_NO}
                    error={fieldErrors.isPep}
                    disabled={busy}
                  />
                  <ActivityRadioGroup
                    id="step3-is-pep-associate"
                    name="isPepAssociate"
                    label="PEP associate"
                    hint="Are you a close associate or family member of a PEP?"
                    value={isPepAssociate}
                    onChange={(v) => setPepBool("isPepAssociate", setIsPepAssociate, v)}
                    options={PROOF_OF_FUNDS_YES_NO}
                    error={fieldErrors.isPepAssociate}
                    disabled={busy}
                  />
                  <ActivityRadioGroup
                    id="step3-has-sanctions"
                    name="hasSanctions"
                    label="Sanctions exposure"
                    hint="Any matches or exposure to sanctions lists?"
                    value={hasSanctions}
                    onChange={(v) => setPepBool("hasSanctions", setHasSanctions, v)}
                    options={PROOF_OF_FUNDS_YES_NO}
                    error={fieldErrors.hasSanctions}
                    disabled={busy}
                  />
                  <ActivityRadioGroup
                    id="step3-has-adverse-media"
                    name="hasAdverseMedia"
                    label="Adverse media"
                    hint="Any known adverse media concerning you or your business?"
                    value={hasAdverseMedia}
                    onChange={(v) => setPepBool("hasAdverseMedia", setHasAdverseMedia, v)}
                    options={PROOF_OF_FUNDS_YES_NO}
                    error={fieldErrors.hasAdverseMedia}
                    disabled={busy}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-8 space-y-4">
              <section
                className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-4 shadow-sm sm:px-5 sm:py-5"
                aria-labelledby="step3-about-risk-title"
              >
                <h3 id="step3-about-risk-title" className="text-sm font-semibold text-amber-950">
                  About Risk Assessment
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-amber-950/90">
                  This questionnaire helps us assess the risk profile of your business activities. Your answers are used
                  to comply with Anti-Money Laundering (AML) regulations and ensure we provide appropriate services. All
                  information is kept confidential and secure.
                </p>
              </section>

              <section
                className="rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-4 shadow-sm sm:px-5 sm:py-5"
                aria-labelledby="step3-privacy-risk-title"
              >
                <h3 id="step3-privacy-risk-title" className="text-sm font-semibold text-slate-900">
                  Privacy &amp; Security
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  All documents are encrypted and stored securely. We only use your information for identity verification
                  and compliance purposes. Your data is protected in accordance with GDPR and our Privacy Policy.
                </p>
              </section>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <button
              type="button"
              onClick={goPrevious}
              disabled={activeStep === 0 || busy}
              aria-label="Previous step"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={busy || !currentStepComplete}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <InlineSubmitSpinner />
                  Submitting…
                </>
              ) : activeStep === STEPS.length - 1 ? (
                "Submit & go to dashboard"
              ) : (
                <>
                  Next
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
