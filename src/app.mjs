import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.mjs";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorMiddleware.mjs";
import { authRoutes } from "./modules/auth/authRoutes.mjs";
import { movieRoutes } from "./modules/movie/movieRoutes.mjs";
import { profileRoutes } from "./modules/profile/profileRoutes.mjs";
import { watchlistRoutes } from "./modules/watchlist/watchlistRoutes.mjs";

dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.PRODUCTION_URL
        : process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser("TU_SECRETO_ESTABLE"));
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Manejar rutas no encontradas
app.use(notFoundHandler);

// Manejador de errores
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
