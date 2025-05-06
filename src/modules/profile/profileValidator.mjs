import { body, header, param } from "express-validator";
import { validate } from "../../middlewares/validate.mjs";

const profileIdParamValidation = param("profileId")
  .isMongoId()
  .withMessage("El id del perfil a editar no es valido");

const nameValidation = body("name")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Se requiere un nombre de usuario")
  .isString()
  .withMessage("El nombre de usuario debe ser un string");

const typeValidation = body("type")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Se requiere un tipo de perfil")
  .isIn(["standard", "kid"])
  .withMessage("El tipo de perfil deber ser [standard|kid]");

const activeProfileHeaderValidation = header("Active-Profile-ID")
  .exists()
  .withMessage("Active-Profile header es requerido")
  .isMongoId()
  .withMessage("El header Active-Profile debe poseer un id valido");

// Validar peticiones
export const validateCreateProfile = validate([nameValidation, typeValidation]);

export const validateDeleteProfile = validate([
  header("Active-Profile-ID")
    .exists()
    .withMessage("Active-Profile header es requerido")
    .isMongoId()
    .withMessage("El header Active-Profile debe poseer un id valido"),
  param("profileId")
    .isMongoId()
    .withMessage("El id del perfil a eliminar no es valido"),
]);

export const validateUpdateProfile = validate([
  activeProfileHeaderValidation,
  profileIdParamValidation,
  nameValidation,
  typeValidation,
]);
