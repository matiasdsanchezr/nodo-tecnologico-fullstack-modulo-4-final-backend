//creamos las rutas
import express from "express";
import { signup, signin, logout, getUserFromToken } from "./authController.mjs";
import { validateSignin, validateSignup } from "./authValidator.mjs";
import { authenticateToken } from "../../middlewares/authMiddleware.mjs";

const router = express.Router();

router.post("/register", validateSignup, signup);
router.post("/login", validateSignin, signin);
router.get("/me", authenticateToken, getUserFromToken);
router.get("/logout", authenticateToken, logout);

export { router as authRoutes };
