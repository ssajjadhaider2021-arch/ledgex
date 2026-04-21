import { createContext, useContext, useReducer } from "react";

const OnboardingContext = createContext(null);

const initialState = {
  currentStep: 1,
  agreement: { acceptedTerms: false, acceptedPrivacy: false, acceptedMoa: false, fullName: "" },
  aml: { idDocument: null, addressProof: null, businessEvidence: null },
  risk: { businessActivity: "", sourceOfFunds: "", transactionVolume: "", pepStatus: "", complianceIssues: "" },
};

function reducer(state, action) {
  if (action.type === "SET_AGREEMENT_FIELD") return { ...state, agreement: { ...state.agreement, [action.field]: action.value } };
  if (action.type === "SET_AML_FILE") return { ...state, aml: { ...state.aml, [action.field]: action.value } };
  if (action.type === "SET_RISK_ANSWER") return { ...state, risk: { ...state.risk, [action.field]: action.value } };
  if (action.type === "SET_STEP") return { ...state, currentStep: action.step };
  return state;
}

export function OnboardingProvider({ children }) {
  const value = useReducer(reducer, initialState);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingContext() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("OnboardingContext missing");
  return ctx;
}
