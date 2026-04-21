import { useOnboardingContext } from "@/state/onboarding/onboardingContext";

export function useOnboardingState() {
  const [state, dispatch] = useOnboardingContext();
  const setAgreementField = (field, value) => dispatch({ type: "SET_AGREEMENT_FIELD", field, value });
  const setAmlFile = (field, value) => dispatch({ type: "SET_AML_FILE", field, value });
  const setRiskAnswer = (field, value) => dispatch({ type: "SET_RISK_ANSWER", field, value });
  const goToStep = (step) => dispatch({ type: "SET_STEP", step });
  return { state, setAgreementField, setAmlFile, setRiskAnswer, goToStep };
}
