import { profileService } from "./profileService.mjs";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getProfiles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await profileService.getAllByUserId(userId);
    res.json(result);
  } catch (error) {
    console.error("Error obteniendo peliculas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const createProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, ...profileData } = req.body;
    const newProfile = await profileService.create({
      userId,
      type,
      profileData,
    });
    res.json(newProfile);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { profileId } = req.params;
    const deletedProfile = await profileService.delete(userId, profileId);
    res.json(deletedProfile);
    res.status(200);
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileId = req.params.profileId;
    const profileData = req.body;
    const updatedProfile = await profileService.update(userId, profileId, profileData);
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};
