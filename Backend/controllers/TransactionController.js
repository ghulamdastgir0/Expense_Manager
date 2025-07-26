import pool from "../config/db.js";

// 1. Add a new transaction
export const addTransaction = async (req, res) => {
  const { title, type, amount, date, time, category, mode } = req.body;
  const user_id = req.user.id;

  console.log("Adding transaction for user:", user_id);
  console.log("Transaction details:", { title, type, amount, date, time, category, mode });

  if (!user_id || !title || !type || !amount || !date || !time || !category || !mode) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const lowerType = type.toLowerCase();
  if (lowerType !== "income" && lowerType !== "expense") {
    return res.status(400).json({ message: "Type must be either 'income' or 'expense'" });
  }

  console.log(user_id, type, date, time, title, category, mode, amount);

  try {
    await pool.query(
      `CALL add_transaction($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user_id, type, date, time, title, category, mode, amount]
    );

    res.status(201).json({ message: "Transaction added successfully" });
  } catch (err) {
    console.error("Error adding transaction:", err);
    res.status(500).json({ error: err.message });
  }
};


// 2. Get all transactions by user
export const getTransactionsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM get_transactions_by_user($1)`, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Delete a transaction
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(`CALL delete_transaction($1)`, [id]);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Cleanup old transactions
export const cleanupOldTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`SELECT cleanup_old_transactions($1) AS deleted_count`, [userId]);
    res.json({ message: `Deleted ${result.rows[0].deleted_count} old transactions.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM get_all_categories()`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get all payment methods
export const getAllPaymentMethods = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM get_all_payment_methods()`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//7. Get Transactions History
export const getTransactionsHistory = async (req, res) => {
    const userId = req.user.id;
    const month = req.query.month || new Date().getMonth() + 1;
    if(!userId || !month) {
        return res.status(400).json({message: 'User ID and month are required'});
    }
    try{
        const query = 'SELECT * FROM get_transaction_history($1, $2)';
        const values = [userId, month];
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(200).json({message: 'No history found for this month'});
        }
        return res.status(200).json(result.rows);
        
    }
    catch (error) {
        console.error('Error fetching history:', error);
        return res.status(500).json({message: 'Server error'});
    }
}