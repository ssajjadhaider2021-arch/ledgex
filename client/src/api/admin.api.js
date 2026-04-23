import { axiosInstance } from "./auth.api";

export function listAccountants() {
  return axiosInstance.get("/admin/accountants");
}

export function getAccountantById(profileId) {
  return axiosInstance.get(`/admin/accountants/${profileId}`);
}

export function approveAccountant(profileId) {
  return axiosInstance.post(`/admin/accountants/${profileId}/approve`);
}

export function rejectAccountant(profileId, reason) {
  return axiosInstance.post(`/admin/accountants/${profileId}/reject`, {
    reason: reason || undefined,
  });
}
