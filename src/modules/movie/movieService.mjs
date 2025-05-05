import axios from "axios";
import { Movie } from "./movieModel.mjs";

class MovieService {
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
   *
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

  async create(movieData) {
    const movie = new Movie(movieData);
    await movie.save();
    movie.id = movie._id;
    return movie;
  }

  async update(id, movieData) {
    const movie = await Movie.findByIdAndUpdate(id, movieData, {
      new: true,
    });
    if (!movie) {
      throw new Error("Superhéroe no encontrado");
    }
    return movie;
  }

  async delete(id) {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      throw new Error("Superhéroe no encontrado");
    }
    return movie;
  }

  async search({
    page,
    adult,
    genre,
    primary_release_year,
    vote_average_gte,
    vote_average_lte,
  }) {
    const movies = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?language=es-AR`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
          Accept: "application/json",
        },
        params: {
          include_adult: adult,
          page: page,
          sort_by: "popularity.desc",
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
