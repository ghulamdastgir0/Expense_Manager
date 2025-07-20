import db from "../config/db.js"; 
import bcrypt from "bcrypt";

// GET user account details
export const getAccountDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const userResult = await db.query(
      "SELECT u.user_id, u.first_name, u.last_name, u.email, u.image_url, u.join_date, a.currency_id, a.time_zone_id, a.budget_limit, c.symbol, t.utc_offset FROM users u LEFT JOIN accountdetail a ON u.user_id = a.user_id LEFT JOIN currency c ON a.currency_id = c.currency_id LEFT JOIN timezone t ON a.time_zone_id = t.time_zone_id WHERE u.user_id = $1",
      [userId]
    );
    res.json(userResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching account details" });
  }
};

// GET user balance
export const getBalanceDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      "SELECT income, expenses, balance, previous_balance FROM balance_detail WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching balance" });
  }
};

// PATCH user profile
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { first_name, last_name, email, image_url } = req.body;
  try {
    await db.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, image_url = $4 WHERE user_id = $5",
      [first_name, last_name, email, image_url, userId]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

// PATCH account settings
export const updateAccountSettings = async (req, res) => {
  const { userId } = req.params;
  const { currency_id, time_zone_id, budget_limit } = req.body;
  try {
    await db.query(
      `INSERT INTO accountdetail (user_id, currency_id, time_zone_id, budget_limit)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id)
       DO UPDATE SET currency_id = EXCLUDED.currency_id,
                     time_zone_id = EXCLUDED.time_zone_id,
                     budget_limit = EXCLUDED.budget_limit`,
      [userId, currency_id, time_zone_id, budget_limit]
    );
    res.json({ message: "Account settings updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating account settings" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("DELETE FROM users WHERE user_id = $1", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
};


// GET preferences (currency, timezone, budget)
export const getPreferences = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      `SELECT currency_id, time_zone_id, budget_limit
       FROM accountdetail WHERE user_id = $1`,
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching preferences" });
  }
};

// PATCH password
export const updatePassword = async (req, res) => {
  
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    
    const result = await db.query(
      "SELECT password FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedPassword = result.rows[0].password;

    if (storedPassword !== currentPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    await db.query(
      "UPDATE users SET password = $1 WHERE user_id = $2",
      [newPassword, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }

};

// DELETE all data except user
export const deleteAllUserData = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("DELETE FROM transaction_details WHERE transaction_id IN (SELECT transaction_id FROM transactions WHERE user_id = $1)", [userId]);
    await db.query("DELETE FROM transactions WHERE user_id = $1", [userId]);
    await db.query("DELETE FROM balance_detail WHERE user_id = $1", [userId]);
    res.json({ message: "All user data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user data" });
  }
};

// GET dashboard summary (balance, income, expense, top 5 categories)
export const getDashboardStats = async (req, res) => {
  const { userId } = req.params;
  try {
    const [balanceData] = await Promise.all([
      db.query(
        "SELECT income, expenses, balance, previous_balance FROM balance_detail WHERE user_id = $1",
        [userId]
      ),
    ]);

    const topCategories = await db.query(
      `SELECT cat.name AS category, SUM(td.amount) AS expense
       FROM transaction_details td
       JOIN transactions t ON td.transaction_id = t.transaction_id
       JOIN category cat ON td.category_id = cat.category_id
       WHERE t.user_id = $1 AND t.type = 'expense'
       GROUP BY cat.name ORDER BY expense DESC LIMIT 5`,
      [userId]
    );

    res.json({
      ...balanceData.rows[0],
      topExpenses: topCategories.rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching dashboard stats" });
  }
};
