import { NotFoundError } from "../../utils/errors.mjs";
import { watchlistService } from "./watchlistService.mjs";

/**
 * Obtener una lista paginada con los items en la watchlist de un perfil
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const getWatchlistItems = async (req, res, next) => {
  try {
    const profileId = req.userContext.activeProfileId;
    const watchlistItems = await watchlistService.getAll(profileId);
    res.json(watchlistItems);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una lista paginada con los items en la watchlist de un perfil
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const createWatchlistItem = async (req, res, next) => {
  try {
    const profileId = req.userContext.activeProfileId;
    const newItemData = req.body;
    const newItem = await watchlistService.addItemToWatchlist(
      profileId,
      newItemData
    );
    res.json(newItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una lista paginada con los items en la watchlist de un perfil
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const deleteWatchlistItem = async (req, res, next) => {
  try {
    const profileId = req.userContext.activeProfileId;
    const { id } = req.params;
    const deletedItem = await watchlistService.deleteWatchlistItem(
      profileId,
      id
    );
    res.json(deletedItem);
  } catch (error) {
    next(error);
  }
};
