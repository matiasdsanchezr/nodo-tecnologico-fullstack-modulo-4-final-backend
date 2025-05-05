import { body, param, query } from "express-validator";
import { validate } from "../../middlewares/validate.mjs";

// Validaciones reutilizables
const idValidation = param("id")
  .isNumeric()
  .withMessage("ID de película debe ser un numero valido");

const titleValidation = body("title")
  .trim()
  .notEmpty()
  .withMessage("El título es requerido")
  .isLength({ max: 100 })
  .withMessage("Máximo 100 caracteres");

const yearValidation = body("year")
  .isInt({ min: 1888, max: new Date().getFullYear() + 2 })
  .withMessage(
    `El año debe estar entre 1888 y ${new Date().getFullYear() + 2}`
  );

const genreValidation = body("genres")
  .isArray({ min: 1 })
  .withMessage("Debe tener al menos 1 género")
  .custom((genres) => {
    return genres.every(
      (/** @type {any} */ genre) =>
        typeof genre === "string" && genre.trim().length > 0
    );
  })
  .withMessage("Todos los géneros deben ser textos válidos");

// Creación de película
export const createMovie = validate([
  titleValidation,
  yearValidation,
  body("director").trim().notEmpty().withMessage("El director es requerido"),
  genreValidation,
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duración debe ser en minutos y mayor a 0"),
]);

// Actualización de película
export const updateMovie = validate([
  idValidation,
  titleValidation.optional(),
  yearValidation.optional(),
  body("director")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Director no puede estar vacío"),
  genreValidation.optional(),
  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duración debe ser en minutos y mayor a 0"),
]);

// Obtener por ID
export const getMovieByIdValidation = validate([idValidation]);

// Búsqueda/filtrado
export const searchMovies = validate([
  query("title").optional().trim(),
  query("year").optional().isInt(),
  query("genre").optional().trim(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Límite debe ser entre 1 y 100"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Página debe ser mayor a 0"),
]);

// Eliminación
export const deleteMovie = validate([idValidation]);
