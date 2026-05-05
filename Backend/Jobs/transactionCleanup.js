// ============================================================
// Jobs/transactionCleanup.js
//
// CRON SCHEDULE: 1st of every month at 00:00
//
// LOGIC:
//   Today = 1st May 2026
//   Deletes ALL transactions where transaction_date is in the
//   same month one year ago → April 2025 (month = today's month - 1 year)
//
//   Example timeline:
//     Runs 1 Apr  2026 → deletes all transactions from March 2025
//     Runs 1 May  2026 → deletes all transactions from April 2025  ✓
//     Runs 1 June 2026 → deletes all transactions from May   2025
// ============================================================

import cron from "node-cron";
import pool from "../config/db.js";

/**
 * Deletes transactions that are exactly 1 year old (by month).
 *
 * "1 year old by month" means:
 *   transaction_date falls in the same calendar month
 *   as today but one year earlier.
 *
 *   e.g. cron fires on 2026-05-01:
 *     targetYear  = 2025
 *     targetMonth = 5  (May)
 *     → deletes all rows where transaction_date
 *       is between 2025-05-01 and 2025-05-31
 *
 * Why the month cron fires in, not the previous month?
 *   A transaction created on 30 April 2025 should be deleted
 *   on 1 April 2026 — i.e. when the cron fires in April 2026
 *   (targetYear=2025, targetMonth=4).  That matches your spec.
 */
const deleteOldTransactions = async () => {
  const now = new Date();

  // The target is the SAME month as today, but 1 year back
  // e.g. today = 2026-05-01 → target = 2025-05 (May 2025)
  // e.g. today = 2026-04-01 → target = 2025-04 (April 2025) ← your example
  const targetYear  = now.getFullYear() - 1;
  const targetMonth = now.getMonth() + 1; // JS months are 0-based

  // Build the date range for the entire target month
  const startDate = `${targetYear}-${String(targetMonth).padStart(2, "0")}-01`;
  // Last day of target month: day 0 of NEXT month = last day of this month
  const lastDay = new Date(targetYear, targetMonth, 0).getDate();
  const endDate  = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${lastDay}`;

  console.log(
    `[Cleanup Cron] Running on ${now.toISOString()} — ` +
    `targeting transactions from ${startDate} to ${endDate}`
  );

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // ── Step 1: Find all transactions in the target month ──
    const { rows: targets } = await client.query(
      `SELECT t.transaction_id, t.type, t.user_id, td.amount
       FROM transactions t
       JOIN transaction_details td ON t.transaction_id = td.transaction_id
       WHERE t.transaction_date BETWEEN $1 AND $2`,
      [startDate, endDate]
    );

    if (targets.length === 0) {
      console.log("[Cleanup Cron] No transactions found in target period. Nothing to delete.");
      await client.query("ROLLBACK");
      return;
    }

    console.log(`[Cleanup Cron] Found ${targets.length} transaction(s) to delete.`);

    // ── Step 2: Reverse each transaction's balance impact ──
    // Group by user so we do one UPDATE per user instead of N updates
    const balanceDeltas = {}; // { user_id: { income: 0, expenses: 0 } }

    for (const row of targets) {
      if (!balanceDeltas[row.user_id]) {
        balanceDeltas[row.user_id] = { income: 0, expenses: 0 };
      }
      const amt = parseFloat(row.amount);
      if (row.type === "Income") {
        balanceDeltas[row.user_id].income   += amt;
      } else {
        balanceDeltas[row.user_id].expenses += amt;
      }
    }

    for (const [userId, delta] of Object.entries(balanceDeltas)) {
      await client.query(
        `UPDATE balance_detail
         SET
           income   = income   - $1,
           expenses = expenses - $2,
           balance  = balance  - $1 + $2
         WHERE user_id = $3`,
        [delta.income, delta.expenses, userId]
      );
    }

    // ── Step 3: Delete transaction_details first (FK constraint) ──
    const transactionIds = targets.map((r) => r.transaction_id);

    await client.query(
      `DELETE FROM transaction_details
       WHERE transaction_id = ANY($1::int[])`,
      [transactionIds]
    );

    // ── Step 4: Delete the transactions themselves ──
    const { rowCount } = await client.query(
      `DELETE FROM transactions
       WHERE transaction_id = ANY($1::int[])`,
      [transactionIds]
    );

    await client.query("COMMIT");

    console.log(
      `[Cleanup Cron] ✅ Deleted ${rowCount} transaction(s) ` +
      `from ${startDate} → ${endDate}. ` +
      `Balance updated for ${Object.keys(balanceDeltas).length} user(s).`
    );
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[Cleanup Cron] ❌ Error during cleanup — rolled back:", err);
  } finally {
    client.release();
  }
};

// ── Schedule ─────────────────────────────────────────────────
// "0 0 1 * *" = at 00:00 on the 1st day of every month
cron.schedule("0 0 1 * *", () => {
  console.log("[Cleanup Cron] Triggered — 1st of month cleanup starting...");
  deleteOldTransactions();
});

console.log("[Cleanup Cron] Scheduled: runs at 00:00 on the 1st of every month.");

export { deleteOldTransactions }; // exported so you can test it manually