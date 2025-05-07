import { body } from "express-validator";
import { validate } from "../../middlewares/validate.mjs";

const usernameValidation = body("username")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Se requiere un nombre de usuario")
  .isString()
  .withMessage("El nombre de usuario debe ser un string")
  .toLowerCase();

const emailValidation = body("email")
  .trim()
  .isEmail()
  .withMessage("Se requiere un email valido")
  .toLowerCase();

const passwordValidation = body("password")
  .trim()
  .isStrongPassword()
  .withMessage("Se requiere una contraseña segura");

// Validar peticiones
export const validateSignup = validate([
  usernameValidation,
  emailValidation,
  passwordValidation,
]);

export const validateSignin = validate([emailValidation, passwordValidation]);
