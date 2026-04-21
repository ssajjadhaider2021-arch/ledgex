import axios from "axios";

export const AUTH_TOKEN_STORAGE_KEY = "token";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const t = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export function setAuthTokenHeader(token) {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}

export const register = (data) => {
  return axiosInstance.post("/auth/register", {
    email: data.email,
    password: data.password,
    role: data.role,
  });
};

export const verifyEmail = (data) => {
  return axiosInstance.post("/auth/verify-email", {
    email: data.email,
    verificationCode: data.verificationCode,
  });
};

export const login = (data) => axiosInstance.post("/auth/login", data);

export const getMe = () => axiosInstance.get("/auth/me");
