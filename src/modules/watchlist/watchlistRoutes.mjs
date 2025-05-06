import express from "express";
import {
  authMiddleware,
} from "../../middlewares/authMiddleware.mjs";
import {
  createWatchlistItem,
  deleteWatchlistItem,
  getWatchlistItems,
} from "./watchlistController.mjs";
import {
  validateCreateWatchlistItem,
  validateDeleteWatchlistItem,
} from "./watchlistValidator.mjs";
import { requiresProfile } from "../../middlewares/profileMiddleware.mjs";

const router = express.Router();

router.get("/", authMiddleware, requiresProfile, getWatchlistItems);
router.post(
  "/",
  validateCreateWatchlistItem,
  authMiddleware,
  requiresProfile,
  createWatchlistItem
);
router.delete(
  "/:id",
  validateDeleteWatchlistItem,
  authMiddleware,
  requiresProfile,
  deleteWatchlistItem
);

export { router as watchlistRoutes };
