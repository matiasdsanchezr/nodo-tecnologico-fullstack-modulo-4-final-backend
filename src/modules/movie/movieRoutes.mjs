import express from "express";

import { getMovies, getMovieById, searchMovies } from "./movieController.mjs";
import { authenticateToken } from "../../middlewares/authMiddleware.mjs";
import { getMovieByIdValidation } from "./movieValidator.mjs";

const router = express.Router();

// Rutas públicas
//Verifricamos si el usuario tiene acceso y luego verificamos si tiene permisos
router.get("/", authenticateToken, getMovies);
router.get(
  "/details/:id",
  authenticateToken,
  getMovieByIdValidation,
  getMovieById
);
router.get("/search", authenticateToken, searchMovies);

// Rutas protegidas
// router.post("/", authenticateToken, createMovie);
// router.put("/:id", authenticateToken, updateMovie);
// router.delete("/:id", authenticateToken, deleteMovie);

export { router as movieRoutes };
