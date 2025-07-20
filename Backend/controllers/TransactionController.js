import pool from "../config/db.js";

// 1. Add a new transaction
export const addTransaction = async (req, res) => {
  const { user_id, title, type, amount, date, time, category, mode } = req.body;

  try {
    await pool.query("BEGIN");

    // Insert into transactions
    const transactionResult = await pool.query(
      `INSERT INTO transactions (user_id, type, transaction_date, transaction_time)
       VALUES ($1, $2, $3, $4) RETURNING transaction_id`,
      [user_id, type, date, time]
    );
    const transaction_id = transactionResult.rows[0].transaction_id;

    // Get category_id from category name
    const catResult = await pool.query(
      "SELECT category_id FROM category WHERE LOWER(name) = LOWER($1)",
      [category]
    );
    if (catResult.rowCount === 0) throw new Error("Invalid category");
    const category_id = catResult.rows[0].category_id;

    // Get payment_method_id from mode
    const payResult = await pool.query(
      "SELECT payment_method_id FROM paymentmethod WHERE LOWER(name) = LOWER($1)",
      [mode]
    );
    if (payResult.rowCount === 0) throw new Error("Invalid payment method");
    const payment_method_id = payResult.rows[0].payment_method_id;

    // Insert into transaction_details
    await pool.query(
      `INSERT INTO transaction_details (transaction_id, title, category_id, payment_method_id, amount)
       VALUES ($1, $2, $3, $4, $5)`,
      [transaction_id, title, category_id, payment_method_id, amount]
    );

    await pool.query("COMMIT");
    res.status(201).json({ message: "Transaction added", transaction_id });
  } catch (error) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all transactions by a user
export const getTransactionsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(`
      SELECT t.transaction_id, t.type, td.title, td.amount,
             c.name AS category, p.name AS payment_method,
             t.transaction_date, t.transaction_time
      FROM transactions t
      JOIN transaction_details td ON t.transaction_id = td.transaction_id
      JOIN category c ON td.category_id = c.category_id
      JOIN paymentmethod p ON td.payment_method_id = p.payment_method_id
      WHERE t.user_id = $1
      ORDER BY t.transaction_date DESC, t.transaction_time DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 3. Delete a transaction by ID
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM transactions WHERE transaction_id = $1", [id]);
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 4. Cleanup old transactions (older than 6 months)
export const cleanupOldTransactions = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM transactions
       WHERE user_id = $1 AND transaction_date < CURRENT_DATE - INTERVAL '6 months'
       RETURNING transaction_id`,
      [userId]
    );
    res.json({ message: `Deleted ${result.rowCount} old transactions.` });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 5. Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM category ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

// 6. Get all payment methods
export const getAllPaymentMethods = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM paymentmethod ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching payment methods" });
  }
};
