import express from "express";
import {
  authenticateToken,
  hasPermission,
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

const router = express.Router();

router.get("/", authenticateToken, hasPermission(), getWatchlistItems);
router.post(
  "/",
  validateCreateWatchlistItem,
  authenticateToken,
  hasPermission(),
  createWatchlistItem
);
router.delete(
  "/:id",
  validateDeleteWatchlistItem,
  authenticateToken,
  hasPermission(),
  deleteWatchlistItem
);

export { router as watchlistRoutes };
