import { Router } from "express";
import { login, logout, register } from "../controllers/authController.js";

const authRouter = Router();

// ============================================================================
// Authentication Routes
// Base Route: /api/v1/auth
// ============================================================================

// Public Routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

export default authRouter;
