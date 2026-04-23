import { axiosInstance } from "./auth.api";

export function submitAccountantOnboarding(payload) {
  return axiosInstance.post("/accountant/onboarding", payload);
}

export function getAccountantProfile() {
  return axiosInstance.get("/accountant/profile");
}

export function signAccountantMoa(payload) {
  return axiosInstance.post("/accountant/moa-sign", payload);
}

export function saveAccountantProfileStep(payload) {
  return axiosInstance.post("/accountant/profile", payload);
}

export function saveAccountantProfessionalStep(payload) {
  return axiosInstance.post("/accountant/professional", payload);
}

export function saveAccountantAmlStep(formData) {
  return axiosInstance.post("/accountant/aml", formData);
}

export function saveAccountantInsuranceStep(formData) {
  return axiosInstance.post("/accountant/insurance", formData);
}

export function saveAccountantDataProtectionStep(payload) {
  return axiosInstance.post("/accountant/data-protection", payload);
}

export function saveAccountantDeclarationsStep(payload) {
  return axiosInstance.post("/accountant/declarations", payload);
}

export function completeAccountantOnboarding() {
  return axiosInstance.post("/onboarding/complete");
}

export function submitAccountantVerificationDocuments(formData) {
  return axiosInstance.post("/accountant/verification-documents", formData);
}

export function getAccountantVerificationStatus() {
  return axiosInstance.get("/accountant/verification-status");
}
