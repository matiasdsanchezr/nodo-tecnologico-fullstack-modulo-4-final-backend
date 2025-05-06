import { authService } from "../modules/auth/authService.mjs";

/** @type {import("../types/authMiddleware").AuthMiddleware} */
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ message: "Token no proporcionado" });
      return;
    }

    const decodedToken = authService.decodeToken(token);
    if (!decodedToken) {
      res.status(403).json({ message: "Token inválido" });
      return;
    }

    req.user = { id: decodedToken.id };

    next();
  } catch (error) {
    next(error);
  }
};
