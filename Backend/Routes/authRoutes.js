// ============================================================
// Routes/authRoutes.js
// Base path: /api/auth
// ============================================================

import { Router } from "express";
import { authLimiter } from "../server.js";
import { verifyToken } from "../Auth/authMiddleware.js";
import {
  signup,
  signin,
  refreshToken,
  changePassword,
} from "../Controllers/authController.js";

const router = Router();

// Public routes (with stricter rate limiting)
router.post("/signup", authLimiter, signup);
router.post("/signin", authLimiter, signin);
router.post("/refresh", authLimiter, refreshToken);

// Protected routes
router.put("/change-password", verifyToken, changePassword);

export default router;
