// ============================================================
// Controllers/dashboardController.js
// Handles: Balance summary, stats cards, top 5 expenses,
//          budget progress, budget alert check
// ============================================================

import pool from "../config/db.js";

// ── GET /api/dashboard/summary ────────────────────────────────
/**
 * Returns all data needed for the Dashboard page:
 *   - balance (total, income, expenses, previous_balance)
 *   - budget (limit, remaining, percentage)
 *   - top 5 expense categories (for bar chart)
 *   - recent 4 transactions
 */
const getDashboardSummary = async (req, res) => {
  const userId = req.user.user_id;

  try {
    // 1. Balance Detail
    const balanceResult = await pool.query(
      "SELECT income, expenses, balance, previous_balance FROM balance_detail WHERE user_id = $1",
      [userId]
    );
    const balance = balanceResult.rows[0] || {
      income: 0,
      expenses: 0,
      balance: 0,
      previous_balance: 0,
    };

    // 2. Account settings (for budget limit & currency)
    const accountResult = await pool.query(
      `SELECT ad.budget_limit, c.symbol AS currency_symbol, c.currency_id
       FROM accountdetail ad
       LEFT JOIN currency c ON ad.currency_id = c.currency_id
       WHERE ad.user_id = $1`,
      [userId]
    );
    const account = accountResult.rows[0] || { budget_limit: 0, currency_symbol: "$" };

    // 3. Top 5 expense categories this month
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const topExpensesResult = await pool.query(
      "SELECT * FROM get_monthly_expense_summary($1, $2) LIMIT 5",
      [userId, currentMonth]
    );

    // 4. Recent 4 transactions
    const recentResult = await pool.query(
      `SELECT t.transaction_id, t.type, t.transaction_date, t.transaction_time,
              td.title, td.amount,
              c.name AS category, pm.name AS payment_method
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       JOIN category c ON td.category_id = c.category_id
       JOIN paymentmethod pm ON td.payment_method_id = pm.payment_method_id
       WHERE t.user_id = $1
       ORDER BY t.transaction_date DESC, t.transaction_time DESC
       LIMIT 4`,
      [userId]
    );

    // 5. Budget calculations
    const budgetLimit = parseFloat(account.budget_limit) || 0;
    const currentExpenses = parseFloat(balance.expenses) || 0;
    const budgetRemaining = budgetLimit - currentExpenses;
    const budgetPercentage = budgetLimit > 0 ? (currentExpenses / budgetLimit) * 100 : 0;

    // 6. MoM trend calculations (percentage vs previous balance)
    const prevBalance = parseFloat(balance.previous_balance) || 0;
    const currentBalance = parseFloat(balance.balance) || 0;
    const balanceTrend =
      prevBalance > 0
        ? (((currentBalance - prevBalance) / prevBalance) * 100).toFixed(1)
        : "0.0";

    return res.json({
      success: true,
      data: {
        stats: {
          total_balance: parseFloat(balance.balance),
          monthly_income: parseFloat(balance.income),
          monthly_expenses: parseFloat(balance.expenses),
          previous_balance: parseFloat(balance.previous_balance),
          balance_trend: parseFloat(balanceTrend),
          currency_symbol: account.currency_symbol || "$",
        },
        budget: {
          limit: budgetLimit,
          spent: currentExpenses,
          remaining: budgetRemaining,
          percentage: parseFloat(budgetPercentage.toFixed(1)),
          is_exceeded: currentExpenses > budgetLimit && budgetLimit > 0,
        },
        top_expenses: topExpensesResult.rows.map((row) => ({
          category: row.category || row.category_name || "Unknown",
          expenses: parseFloat(row.total_spent),
        })),
        recent_transactions: recentResult.rows,
      },
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/dashboard/budget-alert ──────────────────────────
/**
 * Calls the check_budget_alert stored procedure and returns
 * a structured response the frontend can use.
 */
const getBudgetAlert = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [accountResult, balanceResult] = await Promise.all([
      pool.query(
        `SELECT ad.budget_limit, c.symbol AS currency_symbol
         FROM accountdetail ad
         LEFT JOIN currency c ON ad.currency_id = c.currency_id
         WHERE ad.user_id = $1`,
        [userId]
      ),
      pool.query("SELECT expenses FROM balance_detail WHERE user_id = $1", [userId]),
    ])

    const budgetLimit      = parseFloat(accountResult.rows[0]?.budget_limit) || 0
    const currencySymbol   = accountResult.rows[0]?.currency_symbol || "$"
    const expenses         = parseFloat(balanceResult.rows[0]?.expenses) || 0

    let alertLevel = "safe"
    if (budgetLimit > 0) {
      const percentage = (expenses / budgetLimit) * 100
      if (percentage >= 100) alertLevel = "exceeded"
      else if (percentage >= 80) alertLevel = "warning"
    }

    return res.json({
      success: true,
      data: {
        budget_limit:      budgetLimit,
        current_expenses:  expenses,
        alert_level:       alertLevel,
        message:
          alertLevel === "exceeded"
            ? `Budget exceeded by ${currencySymbol}${(expenses - budgetLimit).toFixed(2)}`
            : alertLevel === "warning"
            ? `Warning: ${((expenses / budgetLimit) * 100).toFixed(0)}% of budget used`
            : "Budget is under control",
      },
    })
  } catch (err) {
    console.error("Budget alert error:", err)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

export { getDashboardSummary, getBudgetAlert };
