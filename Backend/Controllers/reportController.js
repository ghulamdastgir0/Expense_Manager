// ============================================================
// Controllers/reportController.js
// Handles: Monthly summary, daily spending, top categories,
//          income vs expense breakdown, payment mode breakdown
// ============================================================

import pool from "../config/db.js";

// ── GET /api/reports/monthly?month=YYYY-MM ────────────────────
/**
 * Returns expense summary by category for a given month.
 * Uses DB function get_monthly_expense_summary().
 */
const getMonthlySummary = async (req, res) => {
  const userId = req.user.user_id;
  const month = req.query.month || new Date().toISOString().slice(0, 7); // "YYYY-MM"

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({
      success: false,
      message: "month must be in YYYY-MM format",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM get_monthly_expense_summary($1::integer, $2::text)",
      [userId, month]
    );

    return res.json({
      success: true,
      data: {
        month,
        categories: result.rows.map((r) => ({
          category: r.category_name,
          total_spent: parseFloat(r.total_spent),
        })),
        total: result.rows.reduce((sum, r) => sum + parseFloat(r.total_spent), 0),
      },
    });
  } catch (err) {
    console.error("Monthly summary error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reports/daily?date=YYYY-MM-DD ────────────────────
/**
 * Returns income and expense totals for a specific date.
 * Uses DB function get_daily_spending().
 */
const getDailySpending = async (req, res) => {
  const userId = req.user.user_id;
  const date = req.query.date || new Date().toISOString().split("T")[0];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: "date must be in YYYY-MM-DD format",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM get_daily_spending($1::integer, $2::date)",
      [userId, date]
    );

    const income  = result.rows.find((r) => r.type === "Income");
    const expense = result.rows.find((r) => r.type === "Expense");

    return res.json({
      success: true,
      data: {
        date,
        income:   parseFloat(income?.total  || 0),
        expenses: parseFloat(expense?.total || 0),
        net:      parseFloat(income?.total  || 0) - parseFloat(expense?.total || 0),
      },
    });
  } catch (err) {
    console.error("Daily spending error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reports/top-categories?limit=5 ──────────────────
/**
 * Returns top 5 expense categories.
 * Uses DB function get_top_5_expenses(p_user_id integer).
 * Columns returned: category (text), total_amount (numeric)
 */
const getTopCategories = async (req, res) => {
  const userId = req.user.user_id;
  const limit  = Math.min(parseInt(req.query.limit) || 5, 10);

  try {
    const result = await pool.query(
      "SELECT * FROM get_top_5_expenses($1::integer)",
      [userId]
    );

    // DB function returns top 5 — slice in JS if caller wants fewer
    const rows = result.rows.slice(0, limit);

    return res.json({
      success: true,
      data: {
        top_categories: rows.map((r) => ({
          category:    r.category,
          total_spent: parseFloat(r.total_amount),
        })),
      },
    });
  } catch (err) {
    console.error("Top categories error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reports/top-transactions?month=M ────────────────
/**
 * Returns top 5 transactions for a given month number.
 * Uses DB function get_top_5_transactions(p_userid integer, p_month integer).
 * Columns returned: id, description, amount, transaction_time, category
 */
const getTopTransactions = async (req, res) => {
  const userId = req.user.user_id;
  const month  = parseInt(req.query.month) || new Date().getMonth() + 1; // 1-12

  if (month < 1 || month > 12) {
    return res.status(400).json({
      success: false,
      message: "month must be a number between 1 and 12",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM get_top_5_transactions($1::integer, $2::integer)",
      [userId, month]
    );

    return res.json({
      success: true,
      data: {
        month,
        transactions: result.rows.map((r) => ({
          id:               r.id,
          description:      r.description,
          amount:           parseFloat(r.amount),
          transaction_time: r.transaction_time,
          category:         r.category,
        })),
      },
    });
  } catch (err) {
    console.error("Top transactions error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reports/yearly ───────────────────────────────────
/**
 * Returns monthly income vs expense for the LAST 12 MONTHS (rolling window).
 *
 * The window is always computed at request time — no year param needed.
 * e.g. today = May 2026  → returns data for Jun 2025 … May 2026
 *      today = Jun 2026  → returns data for Jul 2025 … Jun 2026  (auto-shifts)
 *
 * Only months that have actual transactions are returned from the DB.
 * The frontend fills in the remaining 12 slots with zeros so the chart
 * always shows a full 12-bar rolling window.
 *
 * Each row includes month_key ("YYYY-MM") so the frontend can match
 * API rows to the correct slot without relying on label strings.
 */
const getYearlyComparison = async (req, res) => {
  const userId = req.user.user_id;

  // Rolling window: first day of the month 11 months ago → last day of current month
  const now       = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);          // 11 months back
  const endDate   = new Date(now.getFullYear(), now.getMonth() + 1, 0);           // last day of current month

  const start = startDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const end   = endDate.toISOString().split("T")[0];   // "YYYY-MM-DD"

  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', t.transaction_date), 'YYYY-MM')   AS month_key,
         TO_CHAR(DATE_TRUNC('month', t.transaction_date), 'Mon YYYY')  AS month_label,
         SUM(CASE WHEN t.type = 'Income'  THEN td.amount ELSE 0 END)   AS income,
         SUM(CASE WHEN t.type = 'Expense' THEN td.amount ELSE 0 END)   AS expenses
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       WHERE t.user_id = $1
         AND t.transaction_date BETWEEN $2 AND $3
       GROUP BY month_key, month_label
       ORDER BY month_key`,
      [userId, start, end]
    );

    return res.json({
      success: true,
      data: {
        period: { from: start, to: end },
        monthly_comparison: result.rows.map((r) => ({
          month_key: r.month_key,           // "2025-06" — used by frontend for slot matching
          month:     r.month_label,         // "Jun 2025" — used for chart axis label
          income:    parseFloat(r.income),
          expenses:  parseFloat(r.expenses),
        })),
      },
    });
  } catch (err) {
    console.error("Yearly comparison error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reports/payment-modes ───────────────────────────
/**
 * Breakdown of total amounts by payment method.
 * Used to populate the "Payment Methods" donut chart.
 */
const getPaymentModeBreakdown = async (req, res) => {
  const userId = req.user.user_id;
  const { from_date, to_date } = req.query;

  const start = from_date || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const end   = to_date   || new Date().toISOString().split("T")[0];

  try {
    const result = await pool.query(
      `SELECT pm.name AS payment_method,
              SUM(td.amount) AS total
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       JOIN paymentmethod pm ON td.payment_method_id = pm.payment_method_id
       WHERE t.user_id = $1
         AND t.transaction_date BETWEEN $2 AND $3
       GROUP BY pm.name
       ORDER BY total DESC`,
      [userId, start, end]
    );

    return res.json({
      success: true,
      data: {
        payment_modes: result.rows.map((r) => ({
          name:  r.payment_method,
          value: parseFloat(r.total),
        })),
      },
    });
  } catch (err) {
    console.error("Payment mode breakdown error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reports/income-vs-expense ───────────────────────
/**
 * Returns total income vs total expense for a date range.
 * Used for the Income vs Expenses donut chart.
 */
const getIncomeVsExpense = async (req, res) => {
  const userId = req.user.user_id;
  const { from_date, to_date } = req.query;

  const start = from_date || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const end   = to_date   || new Date().toISOString().split("T")[0];

  try {
    const result = await pool.query(
      `SELECT
         SUM(CASE WHEN t.type = 'Income'  THEN td.amount ELSE 0 END) AS total_income,
         SUM(CASE WHEN t.type = 'Expense' THEN td.amount ELSE 0 END) AS total_expenses
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       WHERE t.user_id = $1
         AND t.transaction_date BETWEEN $2 AND $3`,
      [userId, start, end]
    );

    const row = result.rows[0];

    return res.json({
      success: true,
      data: {
        income:   parseFloat(row.total_income   || 0),
        expenses: parseFloat(row.total_expenses || 0),
        net:      parseFloat(row.total_income   || 0) - parseFloat(row.total_expenses || 0),
        period:   { from: start, to: end },
      },
    });
  } catch (err) {
    console.error("Income vs expense error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  getMonthlySummary,
  getDailySpending,
  getTopCategories,
  getTopTransactions,
  getYearlyComparison,
  getPaymentModeBreakdown,
  getIncomeVsExpense,
};