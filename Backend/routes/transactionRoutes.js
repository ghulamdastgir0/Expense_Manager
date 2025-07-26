import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  addTransaction,
  getUserTransactions,
  deleteTransaction,
  getAllCategories,
  getAllPaymentMethods,
  cleanupOldTransactions
} from "../controllers/TransactionController.js";

const router = express.Router();

router.post("/add", verifyToken, addTransaction);
router.get("/all/:userId", verifyToken, getUserTransactions);
router.delete("/delete/:transactionId", verifyToken, deleteTransaction);
router.get("/categories", verifyToken, getAllCategories);
router.get("/payment-methods", verifyToken, getAllPaymentMethods);
router.delete("/cleanup/:userId", verifyToken, cleanupOldTransactions);

export default router;
