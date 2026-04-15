import express from "express";
import { 
  registerUser, 
  sendOtp,
  verifyUser, 
  resetPassword, 
  loginAdmin, 
  registerPolice,
  otpLogin,
  login,
  getProfile,
  updateProfile,
  refreshToken
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);           // Citizen Registration
router.post("/send-otp", sendOtp);                // Gen & Console Log OTP
router.post("/verify-user", verifyUser);          // Verify OTP success (logs in)
router.post("/otp-login", otpLogin);              // Handle Firebase OTP login
router.post("/reset-password", resetPassword);    // Set New Password
router.post("/login", login);                      // Unified Login (Citizen/Police)
router.post("/register-police", registerPolice);  // Provisioning

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/refresh", refreshToken);

export default router;
