import { body, header, param } from "express-validator";
import { validate } from "../../middlewares/validate.mjs";

const movieIdValidation = body("movie_id")
  .trim()
  .isNumeric()
  .withMessage("Se requiere un id valido");

const titleValidation = body("title")
  .isString()
  .withMessage("Debe ser un string");

const posterPathValidation = body("poster_path")
  .isString()
  .withMessage("Debe ser un string");

const voteAverageValidation = body("vote_average")
  .isNumeric()
  .withMessage("Debe ser un numero");

const releaseDateValidation = body("release_date")
  .isString()
  .withMessage("Debe ser un numero");

const watchedValidation = body("watched")
  .isBoolean()
  .withMessage("Debe ser un booleano");

const activeProfileIdValidation = header("active-profile-id")
  .isMongoId()
  .withMessage("Se requiere un Active-Profile-ID");

const watchlistItemIdParam = param("id")
  .isNumeric()
  .withMessage("Se requiere un id de pelicula valido");

// Validaciones
export const validateCreateWatchlistItem = validate([
  activeProfileIdValidation,
  movieIdValidation,
  titleValidation,
  posterPathValidation,
  voteAverageValidation,
  releaseDateValidation,
  watchedValidation,
]);

export const validateDeleteWatchlistItem = validate([watchlistItemIdParam]);
