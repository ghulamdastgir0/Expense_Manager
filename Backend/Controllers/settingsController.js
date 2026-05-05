// ============================================================
// Controllers/settingsController.js
// ============================================================

import pool from "../config/db.js";

// ── GET /api/settings ─────────────────────────────────────────
const getSettings = async (req, res) => {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const result = await pool.query(
      `SELECT ad.currency_id, ad.time_zone_id, ad.budget_limit,
              c.symbol AS currency_symbol, c.name AS currency_name,
              tz.utc_offset, tz.country_name AS timezone_country
       FROM accountdetail ad
       LEFT JOIN currency c ON ad.currency_id = c.currency_id
       LEFT JOIN timezone tz ON ad.time_zone_id = tz.time_zone_id
       WHERE ad.user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Account settings not found",
      });
    }

    const row = result.rows[0];

    // ✅ FIX: Return flat fields that match exactly what Settings.jsx reads
    return res.json({
      success: true,
      data: {
        settings: {
          currency_id:      row.currency_id,
          time_zone_id:     row.time_zone_id,
          budget_limit:     row.budget_limit,
          currency_symbol:  row.currency_symbol,
          currency_name:    row.currency_name,
          utc_offset:       row.utc_offset,
          timezone_country: row.timezone_country,
        },
      },
    });
  } catch (err) {
    console.error("Get settings error:", err);
    return res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};

// ── PUT /api/settings ─────────────────────────────────────────
const updateSettings = async (req, res) => {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { currency_id, time_zone_id, budget_limit } = req.body;

  if (!currency_id || !time_zone_id) {
    return res.status(400).json({
      success: false,
      message: "currency_id and time_zone_id are required",
    });
  }

  const parsedBudget = parseFloat(budget_limit) || 0;
  if (parsedBudget < 0) {
    return res.status(400).json({
      success: false,
      message: "budget_limit cannot be negative",
    });
  }

  try {
    // Validate currency exists
    const currencyCheck = await pool.query(
      "SELECT currency_id FROM currency WHERE currency_id = $1",
      [currency_id]
    );
    if (currencyCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid currency_id" });
    }

    // Validate timezone exists
    const tzCheck = await pool.query(
      "SELECT time_zone_id FROM timezone WHERE time_zone_id = $1",
      [time_zone_id]
    );
    if (tzCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid time_zone_id" });
    }

    // ✅ FIX: Explicit type casts so PostgreSQL resolves the procedure correctly
    await pool.query(
      "CALL update_account_settings($1::int, $2::varchar, $3::varchar, $4::int)",
      [userId, currency_id, time_zone_id, parsedBudget]
    );

    // Return updated settings
    const updated = await pool.query(
      `SELECT ad.currency_id, ad.time_zone_id, ad.budget_limit,
              c.symbol AS currency_symbol, c.name AS currency_name,
              tz.utc_offset, tz.country_name AS timezone_country
       FROM accountdetail ad
       LEFT JOIN currency c ON ad.currency_id = c.currency_id
       LEFT JOIN timezone tz ON ad.time_zone_id = tz.time_zone_id
       WHERE ad.user_id = $1`,
      [userId]
    );

    const row = updated.rows[0];

    return res.json({
      success: true,
      message: "Settings updated successfully",
      data: {
        settings: {
          currency_id:      row.currency_id,
          time_zone_id:     row.time_zone_id,
          budget_limit:     row.budget_limit,
          currency_symbol:  row.currency_symbol,
          currency_name:    row.currency_name,
          utc_offset:       row.utc_offset,
          timezone_country: row.timezone_country,
        },
      },
    });
  } catch (err) {
    console.error("Update settings error:", err);
    return res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
};

export { getSettings, updateSettings };