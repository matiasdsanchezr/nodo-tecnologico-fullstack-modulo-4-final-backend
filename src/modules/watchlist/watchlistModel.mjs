import { model, Schema } from "mongoose";

const watchlistItemSchema = new Schema(
  {
    watchlist: {
      type: Schema.Types.ObjectId,
      ref: "Watchlist",
      required: true,
      index: true,
    },
    movie_id: { type: Number, required: true },
    title: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
      default: "",
    },
    vote_average: {
      type: Number,
      required: false,
      default: 0,
    },
    release_date: {
      type: String,
      required: false,
      default: "",
    },
    watched: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

const watchlistSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      index: true,
      required: true,
    },
    movies: {
      type: [watchlistItemSchema],
      required: true,
      default: [],
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    timestamps: true,
  }
);

export const Watchlist = model("Watchlist", watchlistSchema);
