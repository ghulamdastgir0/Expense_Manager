// ============================================================
// Controllers/authController.js
// Handles: Sign Up, Sign In, Refresh Token, Change Password
// ============================================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// ── Helpers ──────────────────────────────────────────────────

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });

// ── POST /api/auth/signup ─────────────────────────────────────
/**
 * Body: { first_name, last_name, email, password }
 * Uses the DB procedure create_user() and then sets up
 * balance_detail + accountdetail rows for the new user.
 */
const signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Basic validation
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: first_name, last_name, email, password",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check for existing email
    const existing = await client.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user via stored procedure (create_user)
    await client.query("CALL create_user($1, $2, $3, $4, $5)", [
      first_name.trim(),
      last_name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      null, // image_url — optional, upload handled separately
    ]);

    // Retrieve the newly created user
    const userResult = await client.query(
      "SELECT user_id, first_name, last_name, email, join_date FROM users WHERE email = $1",
      [email.toLowerCase().trim()]
    );
    const user = userResult.rows[0];

    // Initialise balance_detail row
    await client.query(
      `INSERT INTO balance_detail (user_id, income, expenses, balance, previous_balance)
       VALUES ($1, 0, 0, 0, 0)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.user_id]
    );

    // Initialise accountdetail row (defaults: USD, UTC+5, no budget limit)
    await client.query(
      `INSERT INTO accountdetail (user_id, currency_id, time_zone_id, budget_limit)
       VALUES ($1, 'USD', 'Asia/Karachi', 0)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.user_id]
    );

    await client.query("COMMIT");

    // Issue tokens
    const tokenPayload = { user_id: user.user_id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          join_date: user.join_date,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Server error during signup" });
  } finally {
    client.release();
  }
};

// ── POST /api/auth/signin ─────────────────────────────────────
/**
 * Body: { email, password }
 * Compares bcrypt hash; returns user profile + tokens.
 */
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    // Use login_user DB function to get user row
    const result = await pool.query(
      `SELECT u.user_id, u.first_name, u.last_name, u.email,
              u.image_url, u.join_date, u.password
       FROM users u WHERE u.email = $1`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Fetch account details for the response
    const accountResult = await pool.query(
      `SELECT ad.currency_id, ad.time_zone_id, ad.budget_limit,
              c.symbol AS currency_symbol, c.name AS currency_name
       FROM accountdetail ad
       LEFT JOIN currency c ON ad.currency_id = c.currency_id
       WHERE ad.user_id = $1`,
      [user.user_id]
    );

    const balanceResult = await pool.query(
      "SELECT income, expenses, balance, previous_balance FROM balance_detail WHERE user_id = $1",
      [user.user_id]
    );

    // Issue tokens
    const tokenPayload = { user_id: user.user_id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return res.json({
      success: true,
      message: "Signed in successfully",
      data: {
        user: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          image_url: user.image_url,
          join_date: user.join_date,
        },
        account: accountResult.rows[0] || null,
        balance: balanceResult.rows[0] || null,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ success: false, message: "Server error during signin" });
  }
};

// ── POST /api/auth/refresh ────────────────────────────────────
/**
 * Body: { refreshToken }
 * Returns a new accessToken.
 */
const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken({
      user_id: decoded.user_id,
      email: decoded.email,
    });

    return res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Refresh token has expired. Please sign in again.",
        expired: true,
      });
    }
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

// ── PUT /api/auth/change-password ─────────────────────────────
/**
 * Protected route.
 * Body: { current_password, new_password }
 */
const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.user_id;

  if (!current_password || !new_password) {
    return res.status(400).json({
      success: false,
      message: "current_password and new_password are required",
    });
  }

  if (new_password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters",
    });
  }

  if (current_password === new_password) {
    return res.status(400).json({
      success: false,
      message: "New password cannot be the same as the current password",
    });
  }

  try {
    const result = await pool.query(
      "SELECT password FROM users WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(current_password, result.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedNew = await bcrypt.hash(new_password, saltRounds);

    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
      hashedNew,
      userId,
    ]);

    return res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { signup, signin, refreshToken, changePassword };