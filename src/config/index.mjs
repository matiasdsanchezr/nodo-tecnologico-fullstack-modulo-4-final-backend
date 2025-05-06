export const getConfig = () => {
  const jwtSecret = process.env.JWT_SECRET;
  const port = process.env.PORT || 3000;
  const nodeEnv = process.env.NODE_ENV || "development";
  const mongoDbUri = process.env.MONGO_URI;
  const tmdbToken = process.env.TMDB_TOKEN;
  const appUrl = process.env.APP_URL;
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  if (!jwtSecret) {
    throw new Error("FATAL ERROR: JWT_SECRET environment variable is not set.");
  }
  if (!mongoDbUri) {
    throw new Error("FATAL ERROR: MONGO_URI environment variable is not set.");
  }
  if (!tmdbToken) {
    throw new Error("FATAL ERROR: tmdbToken environment variable is not set.");
  }
  if (!appUrl) {
    throw new Error("FATAL ERROR: appUrl environment variable is not set.");
  }
  if (!allowedOrigin) {
    throw new Error("FATAL ERROR: appUrl environment variable is not set.");
  }

  return {
    jwtSecret,
    port,
    nodeEnv,
    mongoDbUri,
    tmdbToken,
    appUrl,
    allowedOrigin
  };
};
