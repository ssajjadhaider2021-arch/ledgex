import { OnboardingProvider } from "@/state/onboarding/onboardingContext";
import { Step1Agreement } from "@/components/onboarding/steps/Step1Agreement";
import { Step2AML } from "@/components/onboarding/steps/Step2AML";
import { useOnboardingState } from "@/hooks/onboarding/useOnboardingState";

function OnboardingContent() {
  const { state, goToStep } = useOnboardingState();
  return (
    <main className="mx-auto max-w-6xl py-10">
      <h1 className="mb-4 text-3xl font-semibold text-white">Client Onboarding</h1>
      {state.currentStep === 1 && <Step1Agreement onContinue={() => goToStep(2)} />}
      {state.currentStep === 2 && <Step2AML onPrev={() => goToStep(1)} onContinue={() => goToStep(3)} />}
      {state.currentStep === 3 && <div className="rounded-xl border border-white/10 bg-black/20 p-6">Step 3 review placeholder</div>}
    </main>
  );
}

export function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-[#060914] text-zinc-100"><OnboardingContent /></div>
    </OnboardingProvider>
  );
}
