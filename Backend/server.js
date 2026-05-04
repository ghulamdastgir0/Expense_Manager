// ============================================================
// server.js — Express App Entry Point
// Expense Manager Backend
// ============================================================

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// ── Route Imports ────────────────────────────────────────────
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import transactionRoutes from "./Routes/transactionRoutes.js";
import settingsRoutes from "./Routes/settingsRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import reportRoutes from "./Routes/reportRoutes.js";
import referenceRoutes from "./Routes/referenceRoutes.js";
import "./Jobs/transactionCleanup.js";
// ── DB connection test ────────────────────────────────────────
import pool from "./Config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Global Rate Limiter ───────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use(globalLimiter);

// ── Auth-specific stricter limiter (applied inside authRoutes) ─
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please wait 15 minutes.",
  },
});

// ============================================================
// GENERAL MIDDLEWARE
// ============================================================
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ============================================================
// ROUTES
// ============================================================
app.use("/api/auth", authRoutes);           // Sign up / Sign in / Refresh
app.use("/api/users", userRoutes);          // Profile CRUD
app.use("/api/transactions", transactionRoutes); // Transactions CRUD
app.use("/api/settings", settingsRoutes);   // Account settings
app.use("/api/dashboard", dashboardRoutes); // Dashboard aggregates
app.use("/api/reports", reportRoutes);      // Reports & analytics
app.use("/api/reference", referenceRoutes); // Categories, currencies, payment methods

// ============================================================
// HEALTH CHECK
// ============================================================
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      success: true,
      message: "Expense Manager API is running",
      database: "connected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      timestamp: new Date().toISOString(),
    });
  }
});

// ============================================================
// 404 HANDLER
// ============================================================
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);

  // Validation errors from express-validator
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON body" });
  }

  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message || "Internal server error";

  res.status(status).json({ success: false, message });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, async () => {
  console.log(`\n🚀  Expense Manager API`);
  console.log(`   Server  : http://localhost:${PORT}`);
  console.log(`   Health  : http://localhost:${PORT}/api/health`);
  console.log(`   Env     : ${process.env.NODE_ENV}\n`);

  // Verify DB on startup
  try {
    await pool.query("SELECT NOW()");
    console.log("✅  PostgreSQL connected\n");
  } catch (err) {
    console.error("❌  PostgreSQL connection failed:", err.message);
  }
});

export default app;
