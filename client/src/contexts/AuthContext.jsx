import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AUTH_TOKEN_STORAGE_KEY,
  setAuthTokenHeader,
  register as registerApi,
  verifyEmail as verifyEmailApi,
  login as loginApi,
  getMe as getMeApi,
} from "../api/auth.api";

function apiErrorMessage(error) {
  const d = error?.response?.data;
  return d?.message || d?.error || "Request failed";
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const stored = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    setToken(stored || null);
    setAuthTokenHeader(stored || null);
    if (stored) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    if (!stored) {
      setUser(null);
      setIsAuthenticated(false);
      return;
    }
    try {
      const { data } = await getMeApi();
      setUser(data);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      delete axios.defaults.headers.common["Authorization"];
      setAuthTokenHeader(null);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadUser();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadUser]);

  const register = useCallback(async (payload) => {
    try {
      const { data } = await registerApi(payload);
      return data;
    } catch (error) {
      throw new Error(apiErrorMessage(error));
    }
  }, []);

  const verifyEmail = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await verifyEmailApi(payload);

      if (!data?.token || !data?.user) {
        throw new Error("Invalid verify response");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setAuthTokenHeader(data.token);

      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      throw new Error(apiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (payload) => {
    try {
      const { data } = await loginApi(payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setAuthTokenHeader(data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      throw new Error(apiErrorMessage(error));
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    delete axios.defaults.headers.common["Authorization"];
    setAuthTokenHeader(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      loading,
      register,
      verifyEmail,
      login,
      logout,
      loadUser,
    }),
    [user, token, isAuthenticated, loading, register, verifyEmail, login, logout, loadUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
