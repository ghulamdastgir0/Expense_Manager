// ============================================================
// src/services/api.js
// Centralised API client for all backend calls.
// Place this file at: Frontend/src/services/api.js
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Token helpers ─────────────────────────────────────────────
export const getAccessToken  = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// ── Core fetch wrapper ────────────────────────────────────────
/**
 * Makes an authenticated request.
 * Automatically:
 *   - Attaches Bearer token
 *   - Refreshes token on 401 expired and retries once
 *   - Redirects to /signin on refresh failure
 */
const request = async (endpoint, options = {}, retry = true) => {
  const token = getAccessToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Token expired — try to refresh once
  if (response.status === 401 && retry) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      // Retry with new token
      return request(endpoint, options, false);
    } else {
      clearTokens();
      window.location.href = "/signin";
      return;
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
};

const tryRefreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.success && data.data?.accessToken) {
      saveTokens(data.data.accessToken, null); // keep same refresh token
      return true;
    }
  } catch {
    return false;
  }
  return false;
};

// ── Public (no-auth) fetch ────────────────────────────────────
const publicRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const data = await response.json();
  if (!response.ok) throw { status: response.status, ...data };
  return data;
};

// ============================================================
// AUTH API
// ============================================================
export const authAPI = {
  signup: (body) =>
    publicRequest("/auth/signup", { method: "POST", body: JSON.stringify(body) }),

  signin: (body) =>
    publicRequest("/auth/signin", { method: "POST", body: JSON.stringify(body) }),

  refresh: (refreshToken) =>
    publicRequest("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  changePassword: (body) =>
    request("/auth/change-password", { method: "PUT", body: JSON.stringify(body) }),
};

// ============================================================
// USER API
// ============================================================
export const userAPI = {
  getProfile: () => request("/users/profile"),

  updateProfile: (body) =>
    request("/users/profile", { method: "PUT", body: JSON.stringify(body) }),

  deleteAccount: () => request("/users/account", { method: "DELETE" }),
};

// ============================================================
// TRANSACTION API
// ============================================================
export const transactionAPI = {
  add: (body) =>
    request("/transactions", { method: "POST", body: JSON.stringify(body) }),

  getRecent: (limit = 6) =>
    request(`/transactions/recent?limit=${limit}`),

  getHistory: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") params.append(k, v);
    });
    return request(`/transactions/history?${params.toString()}`);
  },

  getById: (id) => request(`/transactions/${id}`),

  delete: (id) => request(`/transactions/${id}`, { method: "DELETE" }),

  deleteAll: () => request("/transactions/all", { method: "DELETE" }),
};

// ============================================================
// SETTINGS API
// ============================================================
export const settingsAPI = {
  get: () => request("/settings"),

  update: (body) =>
    request("/settings", { method: "PUT", body: JSON.stringify(body) }),
};

// ============================================================
// DASHBOARD API
// ============================================================
export const dashboardAPI = {
  getSummary: () => request("/dashboard/summary"),

  getBudgetAlert: () => request("/dashboard/budget-alert"),
};

// ============================================================
// REPORTS API
// ============================================================
export const reportsAPI = {
  getMonthly: (month) =>
    request(`/reports/monthly?month=${month}`),

  getDaily: (date) =>
    request(`/reports/daily?date=${date}`),

  getTopCategories: (limit = 5) =>
    request(`/reports/top-categories?limit=${limit}`),

  getYearlyComparison: (year) =>
    request(`/reports/yearly?year=${year}`),

  getPaymentModes: (from_date, to_date) => {
    const params = new URLSearchParams();
    if (from_date) params.append("from_date", from_date);
    if (to_date) params.append("to_date", to_date);
    return request(`/reports/payment-modes?${params.toString()}`);
  },

  getIncomeVsExpense: (from_date, to_date) => {
    const params = new URLSearchParams();
    if (from_date) params.append("from_date", from_date);
    if (to_date) params.append("to_date", to_date);
    return request(`/reports/income-vs-expense?${params.toString()}`);
  },
};

// ============================================================
// REFERENCE API  (public — no token needed)
// ============================================================
export const referenceAPI = {
  getCategories: () => publicRequest("/reference/categories"),
  getCurrencies: () => publicRequest("/reference/currencies"),
  getPaymentMethods: () => publicRequest("/reference/payment-methods"),
  getTimezones: () => publicRequest("/reference/timezones"),
};
