// ============================================================
// Auth/authMiddleware.js — JWT Verification Middleware
// ============================================================

import jwt from "jsonwebtoken";

/**
 * verifyToken
 * Attaches req.user = { user_id, email, iat, exp } on success.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Expect: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, email }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please sign in again.",
        expired: true,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

/**
 * optionalAuth
 * Same as verifyToken but does NOT block the request if no token is present.
 * Useful for routes that work with or without authentication.
 */
const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      req.user = null;
    }
  }

  next();
};

export { verifyToken, optionalAuth };
