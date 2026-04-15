import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  checkAuth,
  googleAuth,
  googleAuthCallback
} from "../controllers/AuthController.js";
import verifyToken from "../middlewares/AuthmiddleWare.js";
import passport from "passport";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), googleAuthCallback);

export default router;