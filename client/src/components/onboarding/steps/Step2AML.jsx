import React, { useState } from "react";
import { onboardingStep2 } from "../../../api/onboarding.api";

const BUSINESS_TYPES = [
  { value: "", label: "Select…" },
  { value: "limited_company", label: "Limited company" },
  { value: "sole_trader", label: "Sole trader" },
  { value: "partnership", label: "Partnership" },
  { value: "llp", label: "LLP" },
  { value: "other", label: "Other" },
];

const COUNTRIES = [
  { value: "", label: "Select…" },
  { value: "GB", label: "United Kingdom" },
  { value: "IE", label: "Ireland" },
  { value: "US", label: "United States" },
  { value: "EU_OTHER", label: "Other EU" },
  { value: "NON_EU", label: "Outside EU / US" },
];

const BUSINESS_AGES = [
  { value: "", label: "Select…" },
  { value: "0-1", label: "0–1 years" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5+", label: "5+ years" },
];

const SOURCE_OF_FUNDS = [
  { value: "", label: "Select…" },
  { value: "operating_revenue", label: "Operating revenue" },
  { value: "investment", label: "Investment / equity" },
  { value: "loan", label: "Loan / credit" },
  { value: "mixed", label: "Mixed sources" },
  { value: "other", label: "Other" },
];

const TURNOVER = [
  { value: "", label: "Select…" },
  { value: "under_50k", label: "Under £50k" },
  { value: "50k_250k", label: "£50k – £250k" },
  { value: "250k_1m", label: "£250k – £1m" },
  { value: "1m_5m", label: "£1m – £5m" },
  { value: "over_5m", label: "Over £5m" },
];

const TX_FREQUENCY = [
  { value: "", label: "Select…" },
  { value: "low", label: "Low (few per month)" },
  { value: "medium", label: "Medium (weekly)" },
  { value: "high", label: "High (daily+)" },
];

const CASH_PCT = [
  { value: "", label: "Select…" },
  { value: "0-10", label: "0–10%" },
  { value: "10-25", label: "10–25%" },
  { value: "25-50", label: "25–50%" },
  { value: "50+", label: "Over 50%" },
];

const PEP_OPTIONS = [
  { value: "", label: "Select…" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
      >
        {options.map((o, i) => (
          <option key={`${id}-${i}`} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileSlot({ id, label, fileName, onPick }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => {
          const f = e.target.files?.[0];
          onPick(f || null);
        }}
        className="block w-full cursor-pointer text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
      />
      {fileName ? (
        <p className="mt-2 truncate text-xs font-medium text-indigo-700" title={fileName}>
          Selected: {fileName}
        </p>
      ) : (
        <p className="mt-2 text-xs text-slate-500">No file selected</p>
      )}
    </div>
  );
}

/**
 * @param {object} props
 * @param {() => void | Promise<void>} [props.onSuccess]
 * @param {() => void} [props.onContinue] — legacy layout stepper
 * @param {(msg: string) => void} [props.onError]
 * @param {() => void} [props.onPrev]
 */
export function Step2AML({ onSuccess, onContinue, onError, onPrev }) {
  const [passportFile, setPassportFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [businessFile, setBusinessFile] = useState(null);

  const [businessType, setBusinessType] = useState("");
  const [country, setCountry] = useState("");
  const [businessAge, setBusinessAge] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("");
  const [turnover, setTurnover] = useState("");
  const [transactionFrequency, setTransactionFrequency] = useState("");
  const [cashPercentage, setCashPercentage] = useState("");
  const [pep, setPep] = useState("");

  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const goNext = onSuccess ?? onContinue;

  const reportError = (msg) => {
    setLocalError(msg);
    onError?.(msg);
  };

  const riskComplete =
    businessType &&
    country &&
    businessAge &&
    sourceOfFunds &&
    turnover &&
    transactionFrequency &&
    cashPercentage &&
    pep;

  const filesComplete = passportFile && addressFile && businessFile;

  const canSubmit = filesComplete && riskComplete;

  const maxBytes = 10 * 1024 * 1024;
  const extOk = (name) => {
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    return [".pdf", ".jpg", ".jpeg", ".png"].includes(ext);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!canSubmit) {
      reportError("Please upload all documents and complete every risk field.");
      return;
    }
    for (const f of [passportFile, addressFile, businessFile]) {
      if (!extOk(f.name)) {
        reportError("Documents must be PDF, JPG, or PNG.");
        return;
      }
      if (f.size > maxBytes) {
        reportError("Each file must be 10MB or smaller.");
        return;
      }
    }
    setBusy(true);
    try {
      onError?.("");
      setLocalError("");
      const riskAssessment = {
        businessType,
        country,
        businessAge,
        sourceOfFunds,
        turnover,
        transactionFrequency,
        cashPercentage,
        pep,
      };
      const fd = new FormData();
      fd.append("idDocument", passportFile);
      fd.append("addressProof", addressFile);
      fd.append("businessEvidence", businessFile);
      fd.append("riskAssessment", JSON.stringify(riskAssessment));
      await onboardingStep2(fd);
      await goNext?.();
    } catch (err) {
      reportError(err.response?.data?.message || err.message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-10">
        <section>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Section 1 — File uploads</h2>
          <p className="mt-1 text-sm text-slate-500">PDF or image. File names are stored with your application.</p>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <FileSlot
              id="aml-passport"
              label="Passport / ID"
              fileName={passportFile?.name}
              onPick={setPassportFile}
            />
            <FileSlot
              id="aml-address"
              label="Proof of address"
              fileName={addressFile?.name}
              onPick={setAddressFile}
            />
            <div className="md:col-span-2">
              <FileSlot
                id="aml-business"
                label="Business evidence"
                fileName={businessFile?.name}
                onPick={setBusinessFile}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Section 2 — Risk assessment</h2>
          <p className="mt-1 text-sm text-slate-500">All fields are required.</p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SelectField
              id="ra-business-type"
              label="Business type"
              value={businessType}
              onChange={setBusinessType}
              options={BUSINESS_TYPES}
            />
            <SelectField
              id="ra-country"
              label="Country"
              value={country}
              onChange={setCountry}
              options={COUNTRIES}
            />
            <SelectField
              id="ra-age"
              label="Business age"
              value={businessAge}
              onChange={setBusinessAge}
              options={BUSINESS_AGES}
            />
            <SelectField
              id="ra-sof"
              label="Source of funds"
              value={sourceOfFunds}
              onChange={setSourceOfFunds}
              options={SOURCE_OF_FUNDS}
            />
            <SelectField
              id="ra-turnover"
              label="Turnover"
              value={turnover}
              onChange={setTurnover}
              options={TURNOVER}
            />
            <SelectField
              id="ra-tx-freq"
              label="Transaction frequency"
              value={transactionFrequency}
              onChange={setTransactionFrequency}
              options={TX_FREQUENCY}
            />
            <SelectField
              id="ra-cash"
              label="Cash percentage"
              value={cashPercentage}
              onChange={setCashPercentage}
              options={CASH_PCT}
            />
            <SelectField id="ra-pep" label="PEP" value={pep} onChange={setPep} options={PEP_OPTIONS} />
          </div>
        </section>

        {localError && !onError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {localError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
          {onPrev ? (
            <button
              type="button"
              onClick={onPrev}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={!canSubmit || busy}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:ml-auto"
          >
            {busy ? "Submitting…" : "Continue to step 3"}
          </button>
        </div>
      </form>
    </div>
  );
}
