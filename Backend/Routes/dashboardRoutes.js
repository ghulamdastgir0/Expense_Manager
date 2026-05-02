// ============================================================
// Routes/dashboardRoutes.js
// Base path: /api/dashboard
// ============================================================

import { Router } from "express";
import { verifyToken } from "../Auth/authMiddleware.js";
import {
  getDashboardSummary,
  getBudgetAlert,
} from "../Controllers/dashboardController.js";

const router = Router();
router.use(verifyToken);

router.get("/summary", getDashboardSummary);     // GET /api/dashboard/summary
router.get("/budget-alert", getBudgetAlert);     // GET /api/dashboard/budget-alert

export default router;
