// ============================================================
// Controllers/userController.js
// ============================================================

import pool from "../Config/db.js";

// ── GET /api/users/profile ────────────────────────────────────
const getProfile = async (req, res) => {
  console.log("REQ.USER:", req.user);

  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: user_id missing",
    });
  }

  try {
    // ✅ FIX: Removed "phone" — it does not exist in the users table
    const userResult = await pool.query(
      `SELECT user_id, first_name, last_name, email, image_url, join_date
       FROM users WHERE user_id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accountResult = await pool.query(
      `SELECT ad.currency_id, ad.time_zone_id, ad.budget_limit,
              c.symbol AS currency_symbol,
              tz.country_name AS timezone_country
       FROM accountdetail ad
       LEFT JOIN currency c ON ad.currency_id = c.currency_id
       LEFT JOIN timezone tz ON ad.time_zone_id = tz.time_zone_id
       WHERE ad.user_id = $1`,
      [userId]
    );

    const balanceResult = await pool.query(
      `SELECT income, expenses, balance
       FROM balance_detail WHERE user_id = $1`,
      [userId]
    );

    return res.json({
      success: true,
      data: {
        user: userResult.rows[0],
        account: accountResult.rows[0] || {},
        balance: balanceResult.rows[0] || {},
      },
    });
  } catch (err) {
    console.error("❌ Get profile error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ── PUT /api/users/profile ────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    // ✅ AUTH CHECK
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.user_id;
    const { first_name, last_name, email, image_url } = req.body;

    // ✅ VALIDATION
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: "first_name, last_name, email required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ✅ CHECK EMAIL UNIQUE
    const emailCheck = await pool.query(
      "SELECT user_id FROM users WHERE email = $1 AND user_id != $2",
      [email.toLowerCase().trim(), userId]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    // ✅ FIX: image_url can be null (empty circle) or a base64/URL string
    // The stored procedure update_user_info accepts NULL for image param safely
    try {
      // ✅ FIX: Correct procedure name is "update_user_profile" (not "update_user_info")
      // All params are TEXT in the actual DB, first param is integer cast to text is fine
      // Signature: update_user_profile(p_user_id integer, p_first_name text, p_last_name text, p_email text, p_image_url text)
      await pool.query(
        `CALL update_user_profile($1::integer, $2::text, $3::text, $4::text, $5::text)`,
        [
          userId,
          first_name.trim(),
          last_name.trim(),
          email.toLowerCase().trim(),
          image_url || null,
        ]
      );
    } catch (dbErr) {
      console.error("❌ Stored procedure error:", dbErr.message);
      return res.status(500).json({
        success: false,
        message: "Database update failed: " + dbErr.message,
      });
    }

    // ✅ FETCH UPDATED USER — FIX: Removed "phone" column (does not exist)
    const updated = await pool.query(
      `SELECT user_id, first_name, last_name, email, image_url, join_date
       FROM users WHERE user_id = $1`,
      [userId]
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updated.rows[0],
      },
    });

  } catch (err) {
    console.error("❌ Update profile error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// ── DELETE /api/users/account ─────────────────────────────────
const deleteAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.user_id;

    await pool.query("CALL delete_user($1)", [userId]);

    return res.json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (err) {
    console.error("❌ Delete account error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { getProfile, updateProfile, deleteAccount };