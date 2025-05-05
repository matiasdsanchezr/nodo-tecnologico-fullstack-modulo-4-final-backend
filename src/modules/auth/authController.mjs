import { BadRequestError } from "../../utils/errors.mjs";
import { AuthService } from "./authService.mjs";

const authService = new AuthService();

/**
 * Sign up new user
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const signup = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    const token = authService.generateToken(user);
    res.status(201).cookie("authToken", token, cookieOptions).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Sign in with email and password
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = authService.generateToken(user);
    res.cookie("authToken", token, cookieOptions).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Sign in with email and password
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const logout = async (req, res, next) => {
  try {
    const { userId } = req.userContext;

    if (!authService.checkUserExists(userId)) {
      res
        .status(400)
        .cookie("authToken", "", cookieOptions)
        .json({ error: "Usuario no registrado" });
      return;
    }

    res.cookie("authToken", "", cookieOptions).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Get user info using token
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getUserFromToken = async (req, res, next) => {
  try {
    const userId = req.userContext.userId;
    const user = await authService.getUser(userId);
    if (!user) {
      res
        .status(400)
        .cookie("authToken", "", cookieOptions)
        .json({ error: "Usuario no registrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error en getUserFromToken:", error);
    res.status(500).json({ error: "Error al cargar los datos del usuario" });
  }
};

/** @type {import("express").CookieOptions} */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 1000 * 60 * 60 * 24, // Un dia
  domain:
    process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_URL
      : process.env.FRONTEND_URL,
};
