import { profileService } from "../modules/profile/profileService.mjs";
import { UnauthorizedError } from "../utils/errors.mjs";

export const requiresProfile = async (req, res, next) => {
  try {
    let activeProfileId = req.headers["active-profile-id"];
    if (typeof activeProfileId !== "string") {
      throw new UnauthorizedError(
        "Se requiere un header active-profile-id valido."
      );
    }
    const userId = req.user.id;
    const profile = await profileService.getById(activeProfileId);
    if (!profile || profile.user != userId) {
      throw new UnauthorizedError(
        "Se requiere un header active-profile-id valido"
      );
    }

    req.profile = profile.toJSON();
    next();
  } catch (error) {
    next(error);
  }
};
