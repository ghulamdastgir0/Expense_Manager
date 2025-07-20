import express from "express";
import * as UserController from "../controllers/UserController.js";

const router = express.Router();

router.get("/account/:userId", UserController.getAccountDetails);
router.get("/balance/:userId", UserController.getBalanceDetails);
router.get("/preferences/:userId", UserController.getPreferences);
router.get("/dashboard/:userId", UserController.getDashboardStats);

router.patch("/edit/:userId", UserController.updateUserProfile);
router.patch("/account/:userId", UserController.updateAccountSettings);
router.patch("/password/:userId", UserController.updatePassword);

router.delete("/delete/:userId", UserController.deleteUser);
router.delete("/data/:userId", UserController.deleteAllUserData);

export default router;
