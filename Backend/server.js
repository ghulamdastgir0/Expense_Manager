// ============================================================
// server.js — Express App Entry Point
// Expense Manager Backend (PRODUCTION FIXED)
// ============================================================

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// ── Routes ──────────────────────────────────────────────────
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import transactionRoutes from "./Routes/transactionRoutes.js";
import settingsRoutes from "./Routes/settingsRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import reportRoutes from "./Routes/reportRoutes.js";
import referenceRoutes from "./Routes/referenceRoutes.js";

// ── Jobs ────────────────────────────────────────────────────
import "./Jobs/transactionCleanup.js";

// ── DB ──────────────────────────────────────────────────────
import pool from "./config/db.js";

const app = express();

// ============================================================
// PORT (Render safe)
// ============================================================
const PORT = process.env.PORT || 5000;

// ============================================================
// TRUST PROXY (IMPORTANT for Render)
// ============================================================
app.set("trust proxy", 1);

// ============================================================
// SECURITY
// ============================================================
app.use(helmet());

// ============================================================
// CORS (OPEN — allows all origins)
// ============================================================
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// ============================================================
// RATE LIMITING
// ============================================================
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ============================================================
// BODY PARSING
// ============================================================
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// ============================================================
// API ROUTES
// ============================================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reference", referenceRoutes);

// ============================================================
// HEALTH CHECK (IMPORTANT)
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
  } catch (err) {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

// ============================================================
// ROOT ROUTE (FIX for Render testing)
// ============================================================
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Expense Manager Backend Running 🚀",
  });
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
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health: /api/health`);
});