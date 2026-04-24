import { apiUrl, axiosInstance } from "./auth.api";

export function listAccountants() {
  return axiosInstance.get(apiUrl("admin/accountants"));
}

export function getAccountantById(profileId) {
  return axiosInstance.get(apiUrl(`admin/accountants/${profileId}`));
}

export function approveAccountant(profileId) {
  return axiosInstance.post(apiUrl(`admin/accountants/${profileId}/approve`));
}

export function rejectAccountant(profileId, reason) {
  return axiosInstance.post(apiUrl(`admin/accountants/${profileId}/reject`), {
    reason: reason || undefined,
  });
}
