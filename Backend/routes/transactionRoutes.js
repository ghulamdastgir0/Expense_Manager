import express from "express"
import {
  addTransaction,
  getTransactionsByUser,
  deleteTransaction,
  cleanupOldTransactions,
  getAllCategories,
  getAllPaymentMethods
} from "../controllers/TransactionController.js"

const router = express.Router()

router.post("/transactions", addTransaction)
router.get("/transactions/user/:userId", getTransactionsByUser)
router.delete("/transactions/:id", deleteTransaction)
router.post("/transactions/cleanup/:userId", cleanupOldTransactions)

router.get("/categories", getAllCategories)
router.get("/paymentmethods", getAllPaymentMethods)

export default router
