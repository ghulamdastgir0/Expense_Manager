import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getAccountDetails,
  getBalanceDetails,
  updateUserProfile,
  updateAccountSettings,
  deleteUser,
  getPreferences,
  updatePassword,
  deleteAllUserData,
  getDashboard,
  loginUser,
  signUpUser
  
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/details/:userId", verifyToken, getAccountDetails);
router.get("/balance/:userId", verifyToken, getBalanceDetails);
router.patch("/profile/:userId", verifyToken, updateUserProfile);
router.patch("/settings/:userId", verifyToken, updateAccountSettings);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/preferences/:userId", verifyToken, getPreferences);
router.patch("/password/:userId", verifyToken, updatePassword);
router.delete("/clean-data/:userId", verifyToken, deleteAllUserData);
router.get("/dashboard/:userId", verifyToken, getDashboard);
router.post("/login", loginUser);
router.post("/signup", signUpUser);

export default router;
