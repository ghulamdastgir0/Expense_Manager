// ============================================================
// Routes/transactionRoutes.js
// Base path: /api/transactions
// All routes require authentication.
// ============================================================

import { Router } from "express";
import { verifyToken } from "../Middlewares/authMiddleware.js";
import {
  addTransaction,
  getRecentTransactions,
  getTransactionHistory,
  getTransactionById,
  deleteTransaction,
  deleteAllTransactions,
} from "../Controllers/transactionController.js";

const router = Router();

router.use(verifyToken);

// ── Transaction CRUD ─────────────────────────────────────────
router.post("/", addTransaction);                     // POST   /api/transactions
router.get("/recent", getRecentTransactions);         // GET    /api/transactions/recent?limit=6
router.get("/history", getTransactionHistory);        // GET    /api/transactions/history?from_date=&to_date=&...
router.get("/:id", getTransactionById);               // GET    /api/transactions/:id
router.delete("/all", deleteAllTransactions);         // DELETE /api/transactions/all
router.delete("/:id", deleteTransaction);             // DELETE /api/transactions/:id

export default router;
