// ============================================================
// Routes/reportRoutes.js
// Base path: /api/reports
// ============================================================

import { Router } from "express";
import { verifyToken } from "../Auth/authMiddleware.js";
import {
  getMonthlySummary,
  getDailySpending,
  getTopCategories,
  getYearlyComparison,
  getPaymentModeBreakdown,
  getIncomeVsExpense,
} from "../Controllers/reportController.js";

const router = Router();
router.use(verifyToken);

router.get("/monthly", getMonthlySummary);           // GET /api/reports/monthly?month=YYYY-MM
router.get("/daily", getDailySpending);               // GET /api/reports/daily?date=YYYY-MM-DD
router.get("/top-categories", getTopCategories);      // GET /api/reports/top-categories?limit=5
router.get("/yearly", getYearlyComparison);           // GET /api/reports/yearly?year=YYYY
router.get("/payment-modes", getPaymentModeBreakdown); // GET /api/reports/payment-modes?from_date=&to_date=
router.get("/income-vs-expense", getIncomeVsExpense); // GET /api/reports/income-vs-expense?from_date=&to_date=

export default router;
