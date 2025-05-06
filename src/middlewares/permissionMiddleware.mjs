import { ForbiddenError } from "../utils/errors.mjs";

/** @type {import("../types/authMiddleware").HasPermissionFunction} */
export const hasPermission = (requiredPermission = undefined) => {
  return async (req, res, next) => {
    try {
      const profile = req.profile;

      if (!requiredPermission) next();

      const hasPermission = profile.role.permissions.some(
        (permission) => permission.name === requiredPermission
      );

      if (!hasPermission) {
        throw new ForbiddenError(
          "El perfil activo no tiene permisos para realizar esta acción."
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
