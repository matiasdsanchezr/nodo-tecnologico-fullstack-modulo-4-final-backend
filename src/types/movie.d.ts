export type Movie = {
  title: string;
  director: string;
  releaseYear: number;
  genre: string[];
  duration: number;
  rating: number;
  cast: { ["actor" | "role"]: string };
};

export type WatchlistItem = {
  watchlist: string;
  movie_id: string;
  poster_path: string;
  vote_average: number;
  watched: boolean;
};
