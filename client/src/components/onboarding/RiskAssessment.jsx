import { Steps } from "antd";
import { useMemo, useState } from "react";
import { StepperNavigation } from "@/components/onboarding/StepperNavigation";
import { RiskBusinessActivity } from "@/components/onboarding/risk/RiskBusinessActivity";
import { RiskSourceFunds } from "@/components/onboarding/risk/RiskSourceFunds";
import { RiskTransactionVolume } from "@/components/onboarding/risk/RiskTransactionVolume";
import { RiskPepCompliance } from "@/components/onboarding/risk/RiskPepCompliance";

export function RiskAssessment({ value, onChange }) {
  const [index, setIndex] = useState(0);
  const items = ["Business Activity", "Source of Funds", "Transaction Volume", "PEP & Compliance"];
  const complete = useMemo(() => !!(value.businessActivity && value.sourceOfFunds && value.transactionVolume && value.pepStatus && value.complianceIssues), [value]);
  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <Steps size="small" current={index} items={items.map((title) => ({ title }))} />
      <div className="mt-4">
        {index === 0 && <RiskBusinessActivity value={value.businessActivity} onChange={(v) => set("businessActivity", v)} />}
        {index === 1 && <RiskSourceFunds value={value.sourceOfFunds} onChange={(v) => set("sourceOfFunds", v)} />}
        {index === 2 && <RiskTransactionVolume value={value.transactionVolume} onChange={(v) => set("transactionVolume", v)} />}
        {index === 3 && <RiskPepCompliance pepStatus={value.pepStatus} complianceIssues={value.complianceIssues} onPep={(v) => set("pepStatus", v)} onCompliance={(v) => set("complianceIssues", v)} />}
      </div>
      <StepperNavigation canPrev={index > 0} canNext={index < 3} onPrev={() => setIndex((s) => s - 1)} onNext={() => setIndex((s) => s + 1)} nextLabel="Next Question" />
      <p className="mt-2 text-xs text-zinc-400">Risk section complete: {complete ? "Yes" : "No"}</p>
    </div>
  );
}
