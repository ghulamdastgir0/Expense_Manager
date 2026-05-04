import { Router } from "express";
import { authLimiter } from "../Middlewares/rateLimiter.js";
import { verifyToken } from "../Middlewares/authMiddleware.js";
import {
  signup,
  signin,
  refreshToken,
  changePassword,
} from "../Controllers/authController.js";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/signin", authLimiter, signin);
router.post("/refresh", authLimiter, refreshToken);

router.put("/change-password", verifyToken, changePassword);

export default router;