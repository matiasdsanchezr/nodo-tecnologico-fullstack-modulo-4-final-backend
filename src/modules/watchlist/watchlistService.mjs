import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../utils/errors.mjs";
import { Watchlist } from "./watchlistModel.mjs";
import { Profile } from "../profile/profileModel.mjs";

class WatchlistService {
  async getAll(profileId) {
    const watchlistItems = await Watchlist.findOne({ profile: profileId });
    return watchlistItems.movies;
  }

  async getPaginatedWatchlist(profileId, page = 1, limit = 10) {
    const currentPage = page;
    const itemsPerPage = limit;
    const skip = (currentPage - 1) * itemsPerPage;

    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    const pipeline = [
      {
        $match: { profile: profileObjectId },
      },
      {
        $project: {
          _id: 0, // Excluir el _id
          totalItems: { $size: "$movies" }, // Obtener el total de items en el array 'movies'
          data: { $slice: ["$movies", skip, itemsPerPage] }, //Obtener la porción paginada del array
        },
      },
    ];

    const result = await Watchlist.aggregate(pipeline);

    let totalItems = 0;
    let paginatedMovies = [];

    if (result.length > 0) {
      totalItems = result[0].totalItems;
      paginatedMovies = result[0].data;
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data: paginatedMovies,
      pagination: {
        currentPage: currentPage,
        totalPages: totalPages,
        totalItems: totalItems,
      },
    };
  }

  async getById(watchlistId) {
    return await Watchlist.findById(watchlistId);
  }

  async create(profileId) {
    const profile = await Profile.findById(profileId);
    if (!profile) throw new BadRequestError("Usuario no encontrado");

    const newWatchlist = new Watchlist({
      profile: profileId,
      movies: [],
    });

    await newWatchlist.save();
    return newWatchlist;
  }

  /**
   * Registrar una nueva pelicula o item en una watchlist
   * @param {string} profileId
   * @param {import("../../types/movie").WatchlistItem} watchlistItemData
   * @returns
   */
  async addItemToWatchlist(profileId, watchlistItemData) {
    const watchlist = await Watchlist.findOne({ profile: profileId });
    if (!watchlist) {
      throw new BadRequestError("Watchlist no encontrada");
    }

    const existingItem = watchlist.movies.find((item) => {
      return item.movie_id == watchlistItemData.movie_id;
    });

    if (existingItem) {
      throw new BadRequestError(`El item ya esta en la watchlist.`);
    }

    // @ts-ignore
    const newItem = watchlist.movies.create({
      watchlist: watchlist._id,
      ...watchlistItemData,
    });
    watchlist.movies.push(newItem);
    await watchlist.save();

    return newItem;
  }

  async delete(watchlistId) {
    const watchlist = await Watchlist.findByIdAndDelete(watchlistId);
    if (!watchlist) {
      throw new Error("Watchlist no encontrada");
    }
    return watchlist;
  }

  async deleteWatchlistItem(profileId, movie_id) {
    try {
      const updateResult = await Watchlist.findOneAndUpdate(
        { profile: profileId },
        { $pull: { movies: { movie_id } } },
        { new: true }
      );

      if (!updateResult) {
        throw new NotFoundError("Perfil no encontrado");
      }
      return updateResult;
    } catch (error) {
      throw error;
    }
  }
}

export const watchlistService = new WatchlistService();
