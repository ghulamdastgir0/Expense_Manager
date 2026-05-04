// ============================================================
// Routes/settingsRoutes.js
// Base path: /api/settings
// ============================================================

import { Router } from "express";
import { verifyToken } from "../Middlewares/authMiddleware.js";
import { getSettings, updateSettings } from "../Controllers/settingsController.js";

const router = Router();
router.use(verifyToken);

router.get("/", getSettings);   // GET /api/settings
router.put("/", updateSettings); // PUT /api/settings

export default router;
