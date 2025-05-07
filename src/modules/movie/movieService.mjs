import axios from "axios";
import { Movie } from "./movieModel.mjs";

class MovieService {
  /**
   * Obtener peliculas paginadas (10 peliculas por pagina).
   * @param {number} page
   * @returns
   */
  async getAll(page = 1) {
    const movies = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-ES&page=${page}&sort_by=popularity.desc`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    return movies.data;
  }

  /**
   * Obtener detalles de una película mediante su id
   * @param {number} movieId
   * @returns
   */
  async getById(movieId) {
    const fetchMovieDetail = axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?language=es-AR&include_video=true`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    const fetchMovieVideos = axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=es-AR`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    const responses = await Promise.all([fetchMovieDetail, fetchMovieVideos]);

    return { ...responses[0].data, videos: responses[1].data?.results ?? [] };
  }

  /**
   * Obtener una lista de peliculas filtradas y organizadas por página
   * @param {*} param0
   * @returns
   */
  async search({
    page,
    includeAdult,
    genre,
    primary_release_year,
    vote_average_gte,
    vote_average_lte,
    sort_by,
  }) {
    console.log(includeAdult);
    const movies = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?language=es-AR`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          Accept: "application/json",
        },
        params: {
          includeAdult,
          page: page,
          sort_by,
          with_genres: genre,
          primary_release_year,
          "vote_average.gte": vote_average_gte,
          "vote_average.lte": vote_average_lte,
        },
      }
    );
    return movies.data;
  }
}

export { MovieService };
