// ============================================================
// src/api/api.js
// Central API utility — all backend calls go through here.
// Token is read from localStorage (set on login/signup).
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// ── Auth helpers ─────────────────────────────────────────────
export const getToken = () => localStorage.getItem("token")
export const setToken = (token) => localStorage.setItem("token", token)
export const setRefreshToken = (token) => localStorage.setItem("refreshToken", token)
export const getRefreshToken = () => localStorage.getItem("refreshToken")
export const clearTokens = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("user")
}

// ── Base fetch wrapper ────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "API error")
  }

  return data
}

// ============================================================
// AUTH
// ============================================================
export const authAPI = {
  signup: (body) => apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  signin: (body) => apiFetch("/auth/signin", { method: "POST", body: JSON.stringify(body) }),
  refresh: (body) => apiFetch("/auth/refresh", { method: "POST", body: JSON.stringify(body) }),
  changePassword: (body) => apiFetch("/auth/change-password", { method: "PUT", body: JSON.stringify(body) }),
}

// ============================================================
// USERS
// ============================================================
export const userAPI = {
  getProfile: () => apiFetch("/users/profile"),
  updateProfile: (body) => apiFetch("/users/profile", { method: "PUT", body: JSON.stringify(body) }),
  deleteAccount: () => apiFetch("/users/account", { method: "DELETE" }),
}

// ============================================================
// TRANSACTIONS
// ============================================================
export const transactionAPI = {
  add: (body) => apiFetch("/transactions", { method: "POST", body: JSON.stringify(body) }),
  getRecent: (limit = 6) => apiFetch(`/transactions/recent?limit=${limit}`),
  getHistory: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
    ).toString()
    return apiFetch(`/transactions/history${qs ? `?${qs}` : ""}`)
  },
  getById: (id) => apiFetch(`/transactions/${id}`),
  delete: (id) => apiFetch(`/transactions/${id}`, { method: "DELETE" }),
  deleteAll: () => apiFetch("/transactions/all", { method: "DELETE" }),
}

// ============================================================
// DASHBOARD
// ============================================================
export const dashboardAPI = {
  getSummary: () => apiFetch("/dashboard/summary"),
  getBudgetAlert: () => apiFetch("/dashboard/budget-alert"),
  getStats: () => apiFetch("/dashboard/stats"),
}

// ============================================================
// REPORTS
// ============================================================
export const reportAPI = {
  // FIX: No year param — backend now computes a rolling 12-month window automatically.
  // e.g. today = May 2026 → backend returns Jun 2025 … May 2026
  // Next month (Jun 2026) → backend automatically returns Jul 2025 … Jun 2026
  getYearlyComparison: () => apiFetch("/reports/yearly"),

  getTopCategories: (limit = 5) => apiFetch(`/reports/top-categories?limit=${limit}`),

  getPaymentModes: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/reports/payment-modes${qs ? `?${qs}` : ""}`)
  },

  getIncomeVsExpense: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/reports/income-vs-expense${qs ? `?${qs}` : ""}`)
  },

  // Aliases kept for backward compatibility with other parts of the app
  monthly: (month) => apiFetch(`/reports/monthly?month=${month}`),
  daily: (date) => apiFetch(`/reports/daily?date=${date}`),
  yearly: (year) => apiFetch(`/reports/yearly?year=${year}`),
}

// ============================================================
// SETTINGS
// ============================================================
export const settingsAPI = {
  get: () => apiFetch("/settings"),
  update: (body) => apiFetch("/settings", { method: "PUT", body: JSON.stringify(body) }),
}

// ============================================================
// REFERENCE (public — no auth needed)
// ============================================================
export const referenceAPI = {
  categories: () => apiFetch("/reference/categories"),
  currencies: () => apiFetch("/reference/currencies"),
  paymentMethods: () => apiFetch("/reference/payment-methods"),
  timezones: () => apiFetch("/reference/timezones"),
}