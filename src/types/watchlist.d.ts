import { ObjectId } from "mongoose";

export type WatchlistItem = {
  profile: ObjectId;
  movies: Movie[]
};
