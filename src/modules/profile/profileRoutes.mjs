import express from "express";
import {
  createProfile,
  deleteProfile,
  getProfiles,
  updateProfile,
} from "./profileController.mjs";
import { authMiddleware } from "../../middlewares/authMiddleware.mjs";
import {
  validateCreateProfile,
  validateDeleteProfile,
  validateUpdateProfile,
} from "./profileValidator.mjs";
import { hasPermission } from "../../middlewares/permissionMiddleware.mjs";
import { requiresProfile } from "../../middlewares/profileMiddleware.mjs";
const router = express.Router();

router.get("/", authMiddleware, getProfiles);
router.post("/", validateCreateProfile, authMiddleware, createProfile);
router.delete(
  "/:profileId",
  validateDeleteProfile,
  authMiddleware,
  requiresProfile,
  hasPermission("delete:profile"),
  deleteProfile
);
router.put(
  "/:profileId",
  validateUpdateProfile,
  authMiddleware,
  requiresProfile,
  hasPermission("edit:profile"),
  updateProfile
);

export { router as profileRoutes };
