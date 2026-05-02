// ============================================================
// Routes/referenceRoutes.js
// Base path: /api/reference
// No authentication required — these are public lookup tables.
// ============================================================

import { Router } from "express";
import {
  getCategories,
  getCurrencies,
  getPaymentMethods,
  getTimezones,
} from "../Controllers/referenceController.js";

const router = Router();

router.get("/categories", getCategories);           // GET /api/reference/categories
router.get("/currencies", getCurrencies);           // GET /api/reference/currencies
router.get("/payment-methods", getPaymentMethods);  // GET /api/reference/payment-methods
router.get("/timezones", getTimezones);             // GET /api/reference/timezones

export default router;
