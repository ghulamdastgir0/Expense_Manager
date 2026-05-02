// ============================================================
// Controllers/reportController.js
// Handles: Monthly summary, daily spending, top categories,
//          income vs expense breakdown, payment mode breakdown
// All leverage the DB functions from the SQL schema.
// ============================================================

import pool from "../Config/db.js";

// ── GET /api/reports/monthly?month=YYYY-MM ────────────────────
/**
 * Returns expense summary by category for a given month.
 * Uses DB function get_monthly_expense_summary().
 */
const getMonthlySummary = async (req, res) => {
  const userId = req.user.user_id;
  const month = req.query.month || new Date().toISOString().slice(0, 7); // "YYYY-MM"

  // Validate format
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({
      success: false,
      message: "month must be in YYYY-MM format",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM get_monthly_expense_summary($1, $2)",
      [userId, month]
    );

    return res.json({
      success: true,
      data: {
        month,
        categories: result.rows.map((r) => ({
          category: r.category,
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
      "SELECT * FROM get_daily_spending($1, $2)",
      [userId, date]
    );

    const income = result.rows.find((r) => r.type === "Income");
    const expense = result.rows.find((r) => r.type === "Expense");

    return res.json({
      success: true,
      data: {
        date,
        income: parseFloat(income?.total || 0),
        expenses: parseFloat(expense?.total || 0),
        net: parseFloat((income?.total || 0)) - parseFloat((expense?.total || 0)),
      },
    });
  } catch (err) {
    console.error("Daily spending error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reports/top-categories?limit=5 ──────────────────
/**
 * Returns top N expense categories overall.
 * Uses DB function get_top_categories().
 */
const getTopCategories = async (req, res) => {
  const userId = req.user.user_id;
  const limit = Math.min(parseInt(req.query.limit) || 5, 10);

  try {
    const result = await pool.query(
      "SELECT * FROM get_top_categories($1, $2)",
      [userId, limit]
    );

    return res.json({
      success: true,
      data: {
        top_categories: result.rows.map((r) => ({
          category: r.category,
          total_spent: parseFloat(r.total_spent),
        })),
      },
    });
  } catch (err) {
    console.error("Top categories error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/reports/yearly?year=YYYY ────────────────────────
/**
 * Returns monthly income vs expense comparison for an entire year.
 * Used to populate the "Monthly Income vs Expense" bar chart.
 */
const getYearlyComparison = async (req, res) => {
  const userId = req.user.user_id;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  try {
    const result = await pool.query(
      `SELECT
         TO_CHAR(t.transaction_date, 'Mon') AS month,
         EXTRACT(MONTH FROM t.transaction_date) AS month_num,
         SUM(CASE WHEN t.type = 'Income'  THEN td.amount ELSE 0 END) AS income,
         SUM(CASE WHEN t.type = 'Expense' THEN td.amount ELSE 0 END) AS expenses
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       WHERE t.user_id = $1
         AND EXTRACT(YEAR FROM t.transaction_date) = $2
       GROUP BY month, month_num
       ORDER BY month_num`,
      [userId, year]
    );

    return res.json({
      success: true,
      data: {
        year,
        monthly_comparison: result.rows.map((r) => ({
          month: r.month,
          income: parseFloat(r.income),
          expenses: parseFloat(r.expenses),
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
  const end = to_date || new Date().toISOString().split("T")[0];

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
          name: r.payment_method,
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
  const end = to_date || new Date().toISOString().split("T")[0];

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
        income: parseFloat(row.total_income || 0),
        expenses: parseFloat(row.total_expenses || 0),
        net: parseFloat(row.total_income || 0) - parseFloat(row.total_expenses || 0),
        period: { from: start, to: end },
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
  getYearlyComparison,
  getPaymentModeBreakdown,
  getIncomeVsExpense,
};
