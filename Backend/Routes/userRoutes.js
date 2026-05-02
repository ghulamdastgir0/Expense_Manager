// ============================================================
// Routes/userRoutes.js
// Base path: /api/users
// All routes require authentication.
// ============================================================

import { Router } from "express";
import { verifyToken } from "../Auth/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  deleteAccount,
} from "../Controllers/userController.js";

const router = Router();

// Apply auth middleware to all user routes
router.use(verifyToken);

router.get("/profile", getProfile);      // GET  /api/users/profile
router.put("/profile", updateProfile);   // PUT  /api/users/profile
router.delete("/account", deleteAccount); // DELETE /api/users/account

export default router;
