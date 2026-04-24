import { apiUrl, axiosInstance } from "./auth.api";

export const onboardingStep1 = (data) => axiosInstance.post(apiUrl("onboarding/step1"), data);

/** @param {FormData} formData @param {object} [config] */
export const onboardingStep2 = (formData, config) =>
  axiosInstance.post(apiUrl("onboarding/step2"), formData, {
    maxBodyLength: 12 * 1024 * 1024,
    maxContentLength: 12 * 1024 * 1024,
    ...config,
  });

/** Flat risk fields from onboarding step 3 wizard (business activity + source of funds). */
export const submitRiskAssessment = (payload) =>
  axiosInstance.post(apiUrl("onboarding/risk-assessment"), payload);

/** @param {{ riskAnswers: object }} payload */
export const onboardingStep3 = (payload) => axiosInstance.post(apiUrl("onboarding/step3"), payload);

export const onboardingComplete = () => axiosInstance.post(apiUrl("onboarding/complete"), {});
