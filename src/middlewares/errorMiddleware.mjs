import { logger } from "../utils/logger.mjs";
import { CustomError } from "../utils/errors.mjs";

// Manejador de errores principal
const errorHandler = (err, req, res, next) => {
  // Determinar el código de estado HTTP
  const statusCode = err.statusCode || 500;

  // Log del error si es un error inesperado
  if (statusCode === 500) {
    logger.error(err.message, {
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      stack: err.stack,
      ip: req.ip,
      user: req.user?.id, // Si tienes autenticación
    });
  }

  // Construir respuesta de error
  const errorResponse = {
    success: false,
    error: err.name || "ServerError",
    message: err.message || "Ocurrió un error en el servidor",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    details: null,
  };

  // Campos adicionales para errores de validación
  if (err.name === "ValidationError") {
    errorResponse.details = err.errors;
    errorResponse.message = "Error de validación";
  }

  // Campos adicionales para errores personalizados
  if (err.details) {
    errorResponse.details = err.details;
  }

  // Enviar respuesta de error
  res.status(statusCode).json(errorResponse);
};

// Manejador para rutas no encontradas (404)
const notFoundHandler = (req, res, next) => {
  const error = new CustomError(`Ruta no encontrada - ${req.originalUrl}`, 404);
  next(error);
};

// Manejador para errores asíncronos
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, notFoundHandler, asyncHandler };
