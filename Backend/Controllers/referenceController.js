// ============================================================
// Controllers/referenceController.js
// Handles: Categories, Currencies, Payment Methods, Timezones
// These are lookup / dropdown data needed by the frontend.
// No authentication required.
// ============================================================

import pool from "../Config/db.js";

// ── GET /api/reference/categories ────────────────────────────
const getCategories = async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT category_id, name FROM category ORDER BY name"
    );
    return res.json({ success: true, data: { categories: result.rows } });
  } catch (err) {
    console.error("Get categories error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reference/currencies ────────────────────────────
const getCurrencies = async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT currency_id, name, symbol FROM currency ORDER BY name"
    );
    return res.json({ success: true, data: { currencies: result.rows } });
  } catch (err) {
    console.error("Get currencies error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reference/payment-methods ───────────────────────
const getPaymentMethods = async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT payment_method_id, name FROM paymentmethod ORDER BY name"
    );
    return res.json({ success: true, data: { payment_methods: result.rows } });
  } catch (err) {
    console.error("Get payment methods error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reference/timezones ─────────────────────────────
const getTimezones = async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT time_zone_id, country_name, utc_offset FROM timezone ORDER BY utc_offset"
    );
    return res.json({ success: true, data: { timezones: result.rows } });
  } catch (err) {
    console.error("Get timezones error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { getCategories, getCurrencies, getPaymentMethods, getTimezones };
