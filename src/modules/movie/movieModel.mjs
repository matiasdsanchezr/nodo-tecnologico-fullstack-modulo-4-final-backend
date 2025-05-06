import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      trim: true,
      unique: true,
    },
    director: {
      type: String,
      // required: true,
    },
    releaseYear: {
      type: Number,
      min: [1895, "No hay películas antes de 1895"],
      max: [new Date().getFullYear(), "El año no puede ser en el futuro"],
    },
    genre: {
      type: [String],
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Fantasy",
        "Horror",
        "Sci-Fi",
        "Thriller",
        "Other",
      ],
      default: ["Other"],
    },
    duration: {
      type: Number, // en minutos
      min: [1, "La duración debe ser al menos 1 minuto"],
      required: false,
    },
    rating: {
      type: Number,
      min: [0, "El rating mínimo es 0"],
      max: [10, "El rating máximo es 10"],
      default: 0,
    },
    cast: {
      type: {
        actor: String,
        role: String,
      },
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para mejor performance
movieSchema.index({ title: "text", director: "text" });

// Virtual para propiedad calculada
movieSchema.virtual("formattedDuration").get(function () {
  if (!this.duration) return "Duración desconocida";
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

export const Movie = mongoose.model("Movie", movieSchema);
