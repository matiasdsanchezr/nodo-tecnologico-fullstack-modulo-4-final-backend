import { profileService } from "./profileService.mjs";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getProfiles = async (req, res, next) => {
  try {
    const userId = req.userContext.userId;
    const result = await profileService.getAll(userId);
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
    const userId = req.userContext.userId;
    const { type, ...profileData } = req.body;
    const newProfile = await profileService.create({
      userId,
      type,
      profileData,
    });
    res.json(newProfile);
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
export const deleteProfile = async (req, res, next) => {
  try {
    const { userId } = req.userContext;
    const { profileId } = req.params;
    const deletedProfile = await profileService.delete(userId, profileId);
    res.json(deletedProfile);
    res.status(200);
  } catch (error) {
    next(error);
  }
};
