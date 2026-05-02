// ============================================================
// Controllers/transactionController.js
// Handles: Add Transaction, Delete, Get Recent,
//          Get History (filtered/sorted), Get Single
// ============================================================

import pool from "../Config/db.js";

// ── POST /api/transactions ────────────────────────────────────
/**
 * Body: {
 *   type         : "Income" | "Expense"  (case-sensitive per DB procedure)
 *   title        : string
 *   amount       : number
 *   date         : "YYYY-MM-DD"
 *   time         : "HH:MM" or "HH:MM:SS"
 *   category_id  : number
 *   payment_method_id : number
 * }
 *
 * Uses the DB stored procedure add_transaction() which also
 * updates balance_detail automatically.
 */
const addTransaction = async (req, res) => {
  const userId = req.user.user_id;
  const { type, title, amount, date, time, category_id, payment_method_id } = req.body;

  // Validation
  if (!type || !title || !amount || !date || !time || !category_id || !payment_method_id) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: type, title, amount, date, time, category_id, payment_method_id",
    });
  }

  const normalizedType =
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(); // "Income" or "Expense"

  if (!["Income", "Expense"].includes(normalizedType)) {
    return res.status(400).json({
      success: false,
      message: "type must be 'Income' or 'Expense'",
    });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "amount must be a positive number",
    });
  }

  try {
    // Call the stored procedure — it inserts into transactions,
    // transaction_details and updates balance_detail
    await pool.query(
      "CALL add_transaction($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        userId,
        normalizedType,
        date,
        time,
        title.trim(),
        parseInt(category_id),
        parseInt(payment_method_id),
        parsedAmount,
      ]
    );

    // Return the newly created transaction
    const result = await pool.query(
      `SELECT t.transaction_id, t.type, t.transaction_date, t.transaction_time,
              td.title, td.amount, td.retain_until,
              c.name AS category, pm.name AS payment_method
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       JOIN category c ON td.category_id = c.category_id
       JOIN paymentmethod pm ON td.payment_method_id = pm.payment_method_id
       WHERE t.user_id = $1
       ORDER BY t.transaction_id DESC
       LIMIT 1`,
      [userId]
    );

    return res.status(201).json({
      success: true,
      message: `${normalizedType} transaction added successfully`,
      data: { transaction: result.rows[0] },
    });
  } catch (err) {
    console.error("Add transaction error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/transactions/recent?limit=6 ─────────────────────
/**
 * Returns the most recent N transactions for the logged-in user.
 */
const getRecentTransactions = async (req, res) => {
  const userId = req.user.user_id;
  const limit = Math.min(parseInt(req.query.limit) || 6, 50);

  try {
    const result = await pool.query(
      `SELECT t.transaction_id, t.type, t.transaction_date, t.transaction_time,
              td.title, td.amount,
              c.name AS category,
              pm.name AS payment_method
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       JOIN category c ON td.category_id = c.category_id
       JOIN paymentmethod pm ON td.payment_method_id = pm.payment_method_id
       WHERE t.user_id = $1
       ORDER BY t.transaction_date DESC, t.transaction_time DESC
       LIMIT $2`,
      [userId, limit]
    );

    return res.json({
      success: true,
      data: { transactions: result.rows },
    });
  } catch (err) {
    console.error("Get recent transactions error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/transactions/history ────────────────────────────
/**
 * Query params:
 *   from_date   "YYYY-MM-DD"   (optional)
 *   to_date     "YYYY-MM-DD"   (optional)
 *   category    string         (optional, case-insensitive)
 *   type        "income"|"expense" (optional)
 *   sort_by     "date"|"amount"|"category"|"description" (default: date)
 *   sort_order  "asc"|"desc"  (default: desc)
 *   search      string        (optional, searches title)
 *
 * Uses the DB function get_transaction_history() for date range;
 * additional filters applied in SQL.
 */
const getTransactionHistory = async (req, res) => {
  const userId = req.user.user_id;
  const {
    from_date,
    to_date,
    category,
    type,
    sort_by = "date",
    sort_order = "desc",
    search,
  } = req.query;

  // Default: last 90 days
  const start = from_date || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const end = to_date || new Date().toISOString().split("T")[0];

  // Allowed sort fields mapped to SQL columns
  const sortFieldMap = {
    date: "t.transaction_date",
    amount: "td.amount",
    category: "c.name",
    description: "td.title",
  };
  const sqlSortField = sortFieldMap[sort_by] || "t.transaction_date";
  const sqlSortOrder = sort_order === "asc" ? "ASC" : "DESC";

  try {
    let query = `
      SELECT t.transaction_id, t.type,
             t.transaction_date, t.transaction_time,
             td.title, td.amount, td.retain_until,
             c.name AS category, c.category_id,
             pm.name AS payment_method, pm.payment_method_id
      FROM transactions t
      JOIN transaction_details td ON t.transaction_id = td.transaction_id
      JOIN category c ON td.category_id = c.category_id
      JOIN paymentmethod pm ON td.payment_method_id = pm.payment_method_id
      WHERE t.user_id = $1
        AND t.transaction_date BETWEEN $2 AND $3
    `;
    const params = [userId, start, end];
    let paramIndex = 4;

    if (category && category !== "all") {
      query += ` AND LOWER(c.name) = LOWER($${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    if (type && type !== "all") {
      const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
      query += ` AND t.type = $${paramIndex}`;
      params.push(normalizedType);
      paramIndex++;
    }

    if (search) {
      query += ` AND td.title ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY ${sqlSortField} ${sqlSortOrder}`;

    const result = await pool.query(query, params);

    return res.json({
      success: true,
      data: {
        transactions: result.rows,
        total: result.rows.length,
        filters: { from_date: start, to_date: end, category, type, search },
      },
    });
  } catch (err) {
    console.error("Get history error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── GET /api/transactions/:id ─────────────────────────────────
const getTransactionById = async (req, res) => {
  const userId = req.user.user_id;
  const transactionId = parseInt(req.params.id);

  if (isNaN(transactionId)) {
    return res.status(400).json({ success: false, message: "Invalid transaction ID" });
  }

  try {
    const result = await pool.query(
      `SELECT t.transaction_id, t.type, t.transaction_date, t.transaction_time,
              td.title, td.amount, td.retain_until,
              c.name AS category, c.category_id,
              pm.name AS payment_method, pm.payment_method_id
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       JOIN category c ON td.category_id = c.category_id
       JOIN paymentmethod pm ON td.payment_method_id = pm.payment_method_id
       WHERE t.transaction_id = $1 AND t.user_id = $2`,
      [transactionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    return res.json({ success: true, data: { transaction: result.rows[0] } });
  } catch (err) {
    console.error("Get transaction by ID error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── DELETE /api/transactions/:id ──────────────────────────────
/**
 * Uses the delete_transaction procedure.
 * Also reverses the balance_detail update so the numbers stay accurate.
 */
const deleteTransaction = async (req, res) => {
  const userId = req.user.user_id;
  const transactionId = parseInt(req.params.id);

  if (isNaN(transactionId)) {
    return res.status(400).json({ success: false, message: "Invalid transaction ID" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Confirm ownership & get details before deleting
    const txResult = await client.query(
      `SELECT t.type, td.amount
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       WHERE t.transaction_id = $1 AND t.user_id = $2`,
      [transactionId, userId]
    );

    if (txResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const { type, amount } = txResult.rows[0];

    // Reverse balance impact
    if (type === "Expense") {
      await client.query(
        `UPDATE balance_detail
         SET expenses = expenses - $1, balance = balance + $1
         WHERE user_id = $2`,
        [amount, userId]
      );
    } else {
      await client.query(
        `UPDATE balance_detail
         SET income = income - $1, balance = balance - $1
         WHERE user_id = $2`,
        [amount, userId]
      );
    }

    // Delete via stored procedure (cascades to transaction_details)
    await client.query("CALL delete_transaction($1)", [transactionId]);

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Transaction deleted and balance updated",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete transaction error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
};

// ── DELETE /api/transactions (delete all for user) ────────────
/**
 * Wipes all transactions for the logged-in user (Danger Zone action).
 * Uses cleanup_old_transactions + direct delete.
 */
const deleteAllTransactions = async (req, res) => {
  const userId = req.user.user_id;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Delete all transaction_details first, then transactions
    await client.query(
      `DELETE FROM transaction_details
       WHERE transaction_id IN (
         SELECT transaction_id FROM transactions WHERE user_id = $1
       )`,
      [userId]
    );

    await client.query("DELETE FROM transactions WHERE user_id = $1", [userId]);

    // Reset balance to zero
    await client.query("CALL reset_balance($1)", [userId]);

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "All transaction data deleted and balance reset",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete all transactions error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
};

export {
  addTransaction,
  getRecentTransactions,
  getTransactionHistory,
  getTransactionById,
  deleteTransaction,
  deleteAllTransactions,
};
