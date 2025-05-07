import { getConfig } from "../../config/index.mjs";
import { authService } from "./authService.mjs";

const config = getConfig();

/**
 * Configuracion de cookies
 * @param {number} maxAgeMs
 * @returns {import("express").CookieOptions}
 */
export const getSecureCookieOptions = (maxAgeMs = 1000 * 60 * 60 * 24) => {
  const isProduction = config.nodeEnv === "production";

  return {
    maxAge: maxAgeMs,
    httpOnly: true, // Prevent client-side JavaScript access
    secure: isProduction, // Only send cookie over HTTPS
    sameSite: "none", // Mitigate CSRF attacks
    path: "/", // Cookie accessible from all paths
    // domain: ".yourdomain.com", // Optional: specify domain (e.g., for subdomains)
  };
};

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
    res
      .status(201)
      .cookie("authToken", token, getSecureCookieOptions())
      .json(user);
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
    res.cookie("authToken", token, getSecureCookieOptions()).json(user);
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
    res.cookie("authToken", "", getSecureCookieOptions()).send();
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
    const userId = req.user.id;
    const user = await authService.getUser(userId);
    if (!user) {
      res
        .status(400)
        .cookie("authToken", "", getSecureCookieOptions())
        .json({ error: "Usuario no registrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error en getUserFromToken:", error);
    res.status(500).json({ error: "Error al cargar los datos del usuario" });
  }
};
