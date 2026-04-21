import { axiosInstance } from "./auth.api";

export const getBusinessProfile = () => axiosInstance.get("/business-profile");

export const saveBusinessProfileStep1 = (payload) =>
  axiosInstance.put("/business-profile/step1", payload);

export const saveBusinessProfileStep2 = (payload) =>
  axiosInstance.put("/business-profile/step2", payload);

export const saveBusinessProfileStep3 = (payload) =>
  axiosInstance.put("/business-profile/step3", payload);

export const saveBusinessProfileStep4 = (payload) =>
  axiosInstance.put("/business-profile/step4", payload);
