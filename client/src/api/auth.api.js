import axios from "axios";

export const AUTH_TOKEN_STORAGE_KEY = "token";

export function getApiErrorMessage(error) {
  const res = error?.response;
  if (!res) {
    return typeof error?.message === "string" && error.message.trim() ? error.message : "Request failed";
  }
  const d = res.data;
  if (typeof d === "string" && d.trim()) return d;
  if (d && typeof d.message === "string" && d.message.trim()) return d.message;
  if (d && typeof d.error === "string" && d.error.trim()) return d.error;
  if (Array.isArray(d?.errors) && d.errors.length) {
    const first = d.errors[0];
    if (typeof first === "string") return first;
    if (first?.msg) return String(first.msg);
  }
  return `Request failed (${res.status})`;
}

/** Same-origin `/api` uses Vite dev proxy; set VITE_API_BASE_URL for a full URL in production. */
function resolveApiBaseURL() {
  try {
    const v = import.meta.env?.VITE_API_BASE_URL;
    if (v != null && String(v).trim() !== "") {
      const b = String(v).replace(/\/$/, "");
      return b.endsWith("/") ? b : `${b}/`;
    }
  } catch {
    /* non-Vite */
  }
  const base = "/api";
  return base.endsWith("/") ? base : `${base}/`;
}

export const axiosInstance = axios.create({
  baseURL: resolveApiBaseURL(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * Paths must NOT start with "/" when baseURL is "/api/" — otherwise axios replaces the path and drops "/api"
 * (e.g. /auth/register → http://host/auth/register instead of /api/auth/register).
 */
export function apiUrl(path) {
  return String(path || "").replace(/^\//, "");
}

/** Do not attach a stale JWT to public auth calls (can break register/login after a bad session). */
const PUBLIC_AUTH_PATHS = new Set(["auth/register", "auth/signup", "auth/login", "auth/verify-email"]);

axiosInstance.interceptors.request.use((config) => {
  const rel = typeof config.url === "string" ? config.url : "";
  const pathKey = rel.split("?")[0].replace(/^\//, "");
  const isPublicAuth = pathKey && PUBLIC_AUTH_PATHS.has(pathKey);
  if (isPublicAuth) {
    delete config.headers.Authorization;
  } else {
    const t = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (t) {
      config.headers.Authorization = `Bearer ${t}`;
    }
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
  return axiosInstance.post(apiUrl("auth/register"), {
    email: data.email,
    password: data.password,
    role: data.role,
  });
};

export const verifyEmail = (data) => {
  return axiosInstance.post(apiUrl("auth/verify-email"), {
    email: data.email,
    verificationCode: data.verificationCode,
  });
};

export const login = (data) => axiosInstance.post(apiUrl("auth/login"), data);
export const logout = () => axiosInstance.post(apiUrl("auth/logout"));

export const getMe = () => axiosInstance.get(apiUrl("auth/me"));
