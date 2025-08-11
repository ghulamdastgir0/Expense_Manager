import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  addTransaction,
  deleteTransaction,
  getAllCategories,
  getAllPaymentMethods,
  cleanupOldTransactions,
  getTransactionsHistory,
  getRecentTransactions
} from "../controllers/TransactionController.js";

const router = express.Router();

router.post("/add", verifyToken, addTransaction);
router.delete("/delete", verifyToken, deleteTransaction);
router.get("/categories", verifyToken, getAllCategories);
router.get("/payment-methods", verifyToken, getAllPaymentMethods);
router.delete("/cleanup/:userId", verifyToken, cleanupOldTransactions);
router.get("/history", verifyToken, getTransactionsHistory);
router.get("/recent", verifyToken, getRecentTransactions);

export default router;
