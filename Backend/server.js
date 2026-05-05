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

// Routes
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import transactionRoutes from "./Routes/transactionRoutes.js";
import settingsRoutes from "./Routes/settingsRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import reportRoutes from "./Routes/reportRoutes.js";
import referenceRoutes from "./Routes/referenceRoutes.js";

import "./Jobs/transactionCleanup.js";
import pool from "./Config/db.js";

const app = express();
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
// CORS FIX (IMPORTANT)
// ============================================================
const allowedOrigins = [
  "http://localhost:5173",
  "https://expense-manager-dpb9.vercel.app",
  "https://expense-manager-dpb9.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight fix
app.options("*", cors());

// ============================================================
// RATE LIMIT
// ============================================================
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ============================================================
// ROUTES
// ============================================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/reference", referenceRoutes);

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
  } catch (err) {
    res.status(503).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

// ============================================================
// ROOT FIX (IMPORTANT)
// ============================================================
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Expense Manager Backend is running 🚀",
  });
});

// ============================================================
// 404
// ============================================================
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});