// Simplified Account Controller using PostgreSQL Procedures
import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


// 1. GET user account details
export const getAccountDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM get_account_details($1)", [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching account details" });
  }
};

// 2. GET user balance
export const getBalanceDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM get_balance_details($1)", [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching balance" });
  }
};

// 3. PATCH user profile
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { first_name, last_name, email, image_url } = req.body;
  try {
    await db.query("CALL update_user_profile($1, $2, $3, $4, $5)", [
      userId,
      first_name,
      last_name,
      email,
      image_url,
    ]);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

// 4. PATCH account settings
export const updateAccountSettings = async (req, res) => {
  const { userId } = req.params;
  const { currency_id, time_zone_id, budget_limit } = req.body;
  try {
    await db.query("CALL update_account_settings($1, $2, $3, $4)", [
      userId,
      currency_id,
      time_zone_id,
      budget_limit,
    ]);
    res.json({ message: "Account settings updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error updating account settings" });
  }
};

// 5. DELETE user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("CALL delete_user($1)", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

// 6. GET preferences
export const getPreferences = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM get_preferences($1)", [userId]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error fetching preferences" });
  }
};

// 7. PATCH password
export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;
  try {
    const result = await db.query("SELECT password FROM users WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const storedHash = result.rows[0].password;
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query("CALL update_password($1, $2)", [userId, newHash]);
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 8. DELETE all data except user
export const deleteAllUserData = async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query("CALL delete_all_user_data($1)", [userId]);
    res.json({ message: "All user data deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user data" });
  }
};

// 9. GET dashboard stats
export const getDashboardStats = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM get_dashboard_stats($1)", [userId]);

    if (result.rows.length === 0) {
      return res.json({ income: 0, expenses: 0, balance: 0, previous_balance: 0, topExpenses: [] });
    }

    const { income, expenses, balance, previous_balance } = result.rows[0];
    const topExpenses = result.rows.map(row => ({ category: row.category, expense: row.expense }));

    res.json({ income, expenses, balance, previous_balance, topExpenses });
  } catch (err) {
    res.status(500).json({ error: "Error fetching dashboard stats" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.user_id
    const result = await db.query(`SELECT * FROM get_user_profile($1)`, [userId])
    res.json(result.rows[0])
  } catch (err) {
    console.error("Error fetching profile:", err)
    res.status(500).json({ error: "Internal server error" })
  }
};

export const logoutUser = async (req, res) => {
  try {
    // If using token blacklist, store token here
    res.status(200).json({ message: "Logged out successfully" })
  } catch (err) {
    res.status(500).json({ error: "Logout failed" })
  }
};
