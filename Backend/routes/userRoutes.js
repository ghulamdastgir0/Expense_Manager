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
  signUpUser,
  getUserProfile,
  logoutUser
} from "../controllers/UserController.js";

const router = express.Router();

router.get("/account-details", verifyToken, getAccountDetails);
router.get("/balance", verifyToken, getBalanceDetails);
router.patch("/updateProfile", verifyToken, updateUserProfile);
router.patch("/settings", verifyToken, updateAccountSettings);
router.delete("/delete", verifyToken, deleteUser);
router.get("/preferences", verifyToken, getPreferences);
router.patch("/password", verifyToken, updatePassword);
router.delete("/clean-data", verifyToken, deleteAllUserData);
router.get("/dashboard", verifyToken, getDashboard);
router.post("/login", loginUser);
router.post("/signup", signUpUser);
router.get("/profile", verifyToken, getUserProfile);
router.post("/logout", verifyToken, logoutUser);


export default router;
