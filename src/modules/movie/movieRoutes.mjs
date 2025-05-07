import express from "express";

import { getMovies, getMovieById, searchMovies } from "./movieController.mjs";
import { authMiddleware } from "../../middlewares/authMiddleware.mjs";
import { getMovieByIdValidation } from "./movieValidator.mjs";

const router = express.Router();

router.get("/", authMiddleware, getMovies);
router.get(
  "/details/:id",
  authMiddleware,
  getMovieByIdValidation,
  getMovieById
);
router.get("/search", authMiddleware, searchMovies);

export { router as movieRoutes };
