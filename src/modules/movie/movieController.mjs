import { MovieService } from "./movieService.mjs";

const movieService = new MovieService();

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getMovies = async (req, res, next) => {
  try {
    const page =
      typeof req.query.page === "string" ? req.query.page : undefined;

    if (!page) {
      res.status(404).json({ message: "Query invalida. Se requiere page" });
      return;
    }

    const result = await movieService.getAll(parseInt(page));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Busqueda de peliculas
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const searchMovies = async (req, res, next) => {
  try {
    /** @type {*} */
    const queries = req.query;
    const result = await movieService.search(queries);
    res.json(result);
  } catch (error) {
    next();
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getMovieById = async (req, res, next) => {
  try {
    const movieId =
      typeof req.params.id === "string" ? req.params.id : undefined;
    const movie = await movieService.getById(parseInt(movieId));
    if (!movie) {
      res.status(404).json({ message: "Pelicula no encontrada" });
      return;
    }
    res.json(movie);
  } catch (error) {
    next();
  }
};

/**
 * Crear nueva pelicula
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const createMovie = async (req, res, next) => {
  try {
    const movieData = req.body;
    const movie = await movieService.create(movieData);
    res.status(201).json(movie);
  } catch (error) {
    next();
  }
};

/**
 * Editar pelicula
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const updateMovie = async (req, res, next) => {
  try {
    console.log("Actualizando superhéroe", {
      id: req.params.id,
      updateData: req.body,
    });
    const movieId =
      typeof req.params.id === "string" ? req.params.id : undefined;
    const movieData = req.body;
    const movie = await movieService.update(movieId, movieData);
    if (!movie) {
      res.status(404).json({ message: "Pelicula no encontrada" });
      return;
    }

    res.json(movie);
  } catch (error) {
    next();
  }
};

/**
 * Eliminar pelicula
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const deleteMovie = async (req, res, next) => {
  try {
    const movieId =
      typeof req.params.id === "string" ? req.params.id : undefined;
    const deletedMovie = await movieService.delete(movieId);
    if (!deletedMovie) {
      res.status(404).json({ message: "Pelicula no encontrada" });
      return;
    }

    res.json({ message: "Pelicula eliminada exitosamente" });
  } catch (error) {
    next();
  }
};
