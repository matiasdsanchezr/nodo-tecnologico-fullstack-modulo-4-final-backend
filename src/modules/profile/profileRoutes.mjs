import express from "express";
import {
  createProfile,
  deleteProfile,
  getProfiles,
} from "./profileController.mjs";
import {
  authenticateToken,
  hasPermission,
} from "../../middlewares/authMiddleware.mjs";
import {
  validateCreateProfile,
  validateDeleteProfile,
} from "./profileValidator.mjs";
const router = express.Router();

router.get("/", authenticateToken, getProfiles);
router.post("/", validateCreateProfile, authenticateToken, createProfile);
router.delete(
  "/:profileId",
  validateDeleteProfile,
  authenticateToken,
  hasPermission("delete:profile"),
  deleteProfile
);

export { router as profileRoutes };
