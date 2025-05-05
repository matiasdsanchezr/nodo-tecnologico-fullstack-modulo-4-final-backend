import { validationResult } from "express-validator";

/**
 * Middleware que maneja los resultados de las validaciones
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        param: err.path,
        message: err.msg,
        location: err.location,
      })),
    });
  }

  next();
};

/**
 * Envuelve las validaciones y aplica el manejador de errores
 * @param {Array} validations Array de validaciones de express-validator
 * @returns {Array} Array de middlewares listo para usar en rutas
 */
const validate = (validations) => {
  return [...validations, handleValidationErrors];
};

export { validate };
