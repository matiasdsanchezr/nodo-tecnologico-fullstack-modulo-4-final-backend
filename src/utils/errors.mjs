class CustomError extends Error {
  /**
   * @param {string | undefined} message
   */
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends CustomError {
  /**
   * @param {any} errors
   */
  constructor(errors) {
    super("Error de validación", 400);
    this.errors = errors;
    this.name = "ValidationError";
  }
}

class ConflictError extends CustomError {
  constructor(message = "Error de conflicto") {
    super(message, 409);
    this.name = "Conflict";
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Bad request") {
    super(message, 400);
    this.name = "ConflictError";
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
    this.name = "NotFoundError";
  }
}

class NotFoundError extends CustomError {
  constructor(resource = "Recurso") {
    super(`${resource} no encontrado`, 404);
    this.name = "NotFoundError";
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = "No autorizado") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export {
  CustomError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
};
