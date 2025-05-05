import jwt from "jsonwebtoken";
import { Profile } from "../modules/profile/profileModel.mjs";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.mjs";

/** @type {import("../types/authMiddleware").AuthenticateTokenFunction} */
export const authenticateToken = (req, res, next) => {
  const authToken = req.cookies.authToken;
  if (!authToken) {
    res.status(401).json({ message: "Token no proporcionado" });
    return;
  }
  const activeProfileIdHeader = req.headers["active-profile-id"];
  const activeProfileId =
    typeof activeProfileIdHeader === "string" ? activeProfileIdHeader : "";

  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET ?? "");
    if (typeof decodedToken === "string") {
      throw new Error("El token debe contener un objeto usuario");
    }

    req.userContext = { userId: decodedToken.id, activeProfileId };
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
  }
};

/** @type {import("../types/authMiddleware").HasPermissionFunction} */
export const hasPermission = (requiredPermission = undefined) => {
  return async (req, res, next) => {
    try {
      const { userId, activeProfileId } = req.userContext;

      const profile = await Profile.findById(activeProfileId).populate({
        path: "role",
        populate: {
          path: "permissions",
          model: "Permission",
        },
      });

      if (!profile || profile.user != userId) {
        throw new UnauthorizedError("El header Active-Profile-ID es invalido");
      }

      if (requiredPermission) {
        // @ts-ignore
        const hasPermission = profile.role.permissions.some(
          (permission) => permission.name === requiredPermission
        );

        if (!hasPermission) {
          throw new ForbiddenError(
            "El perfil activo no tiene permisos para realizar esta acción."
          );
        }
      }

      req.userContext = {
        ...req.userContext,
        activeProfileId: profile._id.toString(),
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
