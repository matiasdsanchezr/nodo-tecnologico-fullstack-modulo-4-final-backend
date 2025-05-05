import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, errors, json } = format;
import { join } from "path";
import DailyRotateFile from "winston-daily-rotate-file";

// Formato personalizado para consola
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  if (stack) log += `\n${stack}`; // Para errores con stack trace
  return log;
});

// Formato para archivos (JSON estructurado)
const fileFormat = combine(timestamp(), errors({ stack: true }), json());

// Configuración de transporte para archivos rotativos
const fileTransport = new DailyRotateFile({
  filename: join(__dirname, "../../logs/application-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  format: fileFormat,
});

// Configuración del logger principal
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: { service: "movie-api" },
  transports: [
    // Transporte para consola (solo en desarrollo)
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        consoleFormat
      ),
      silent: process.env.NODE_ENV === "production", // No mostrar logs en consola en prod
    }),
    // Transporte para archivos
    fileTransport,
  ],
  exceptionHandlers: [
    new transports.File({
      filename: join(__dirname, "../../logs/exceptions.log"),
      format: fileFormat,
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: join(__dirname, "../../logs/rejections.log"),
      format: fileFormat,
    }),
  ],
});

// Stream para morgan (logging de HTTP)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Función para inyectar contexto en los logs
logger.withContext = function (context) {
  return {
    info: (message, meta) => logger.info(message, { ...meta, context }),
    warn: (message, meta) => logger.warn(message, { ...meta, context }),
    error: (message, meta) => logger.error(message, { ...meta, context }),
    debug: (message, meta) => logger.debug(message, { ...meta, context }),
  };
};

export { logger };
