//creamos las rutas
import express from "express";
import { signup, signin, logout, getUserFromToken } from "./authController.mjs";
import { validateSignin, validateSignup } from "./authValidator.mjs";
import { authMiddleware } from "../../middlewares/authMiddleware.mjs";

const router = express.Router();

router.post("/register", validateSignup, signup);
router.post("/login", validateSignin, signin);
router.get("/me", authMiddleware, getUserFromToken);
router.get("/logout", authMiddleware, logout);

export { router as authRoutes };
