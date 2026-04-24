import { apiUrl, axiosInstance } from "./auth.api";

export function submitAccountantOnboarding(payload) {
  return axiosInstance.post(apiUrl("accountant/onboarding"), payload);
}

export function getAccountantProfile() {
  return axiosInstance.get(apiUrl("accountant/profile"));
}

export function signAccountantMoa(payload) {
  return axiosInstance.post(apiUrl("accountant/moa-sign"), payload);
}

export function saveAccountantProfileStep(payload) {
  return axiosInstance.post(apiUrl("accountant/profile"), payload);
}

export function saveAccountantProfessionalStep(payload) {
  return axiosInstance.post(apiUrl("accountant/professional"), payload);
}

export function saveAccountantAmlStep(formData) {
  return axiosInstance.post(apiUrl("accountant/aml"), formData);
}

export function saveAccountantInsuranceStep(formData) {
  return axiosInstance.post(apiUrl("accountant/insurance"), formData);
}

export function saveAccountantDataProtectionStep(payload) {
  return axiosInstance.post(apiUrl("accountant/data-protection"), payload);
}

export function saveAccountantDeclarationsStep(payload) {
  return axiosInstance.post(apiUrl("accountant/declarations"), payload);
}

export function completeAccountantOnboarding() {
  return axiosInstance.post(apiUrl("onboarding/complete"));
}

export function submitAccountantVerificationDocuments(formData) {
  return axiosInstance.post(apiUrl("accountant/verification-documents"), formData);
}

export function getAccountantVerificationStatus() {
  return axiosInstance.get(apiUrl("accountant/verification-status"));
}
