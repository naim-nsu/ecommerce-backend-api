import fs from "fs";
import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";
import "winston-mongodb";

import config from "@/configs";

// Ensure logs directory exists
if (!fs.existsSync(config.logDir)) {
  fs.mkdirSync(config.logDir, { recursive: true });
}

// Custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colors for different log levels
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

// Custom format for development
const developmentFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...args } = info;
    const argsString = Object.keys(args).length
      ? Object.entries(args)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join("\n")
      : "";
    return `${timestamp} [${level}]: ${message}${argsString ? "\n" + argsString : ""}\n${stack || ""}`;
  })
);

// Custom format for production
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define transports
const transports = [];

// console transport for production
const prodConsoleTransport = new winston.transports.Console({
  level: "error",
  format: winston.format.combine(
    productionFormat,
    winston.format.prettyPrint()
  ),
  handleExceptions: true,
});

// console transport for development
const devConsoleTransport = new winston.transports.Console({
  level: config.logLevel,
  format: developmentFormat,
  handleExceptions: true,
});

// mongodb transport
const mongoDbTransport = new winston.transports.MongoDB({
  level: config.logLevel,
  db: config.mongoUri,
  dbName: config.dbName,
  collection: "logs",
  storeHost: true,
  capped: true,
  cappedMax: 50000, //can be upgrade later
  tryReconnect: true,
});

// file transport for all logs
const applicationFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(config.logDir, "application-%DATE%.log"),
  datePattern: config.logDatePattern,
  level: config.logLevel,
  format: productionFormat,
  maxFiles: config.logMaxFiles,
  maxSize: config.logMaxSize,
  zippedArchive: true,
});

// file transport for error logs only
const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(config.logDir, "error-%DATE%.log"),
  level: "error",
  datePattern: config.logDatePattern,
  format: productionFormat,
  maxFiles: config.logMaxFiles,
  maxSize: config.logMaxSize,
  zippedArchive: true,
});

// add Console transport
if (config.env === "production") {
  transports.push(prodConsoleTransport, mongoDbTransport);
} else {
  transports.push(devConsoleTransport);
}

// add File transport
transports.push(applicationFileTransport, errorFileTransport);

// Create Winston logger instance
const logger = winston.createLogger({
  level: config.logLevel,
  levels: levels,
  defaultMeta: {
    app: config.appName,
    version: config.appVersion,
  },
  transports,
  handleExceptions: true,
  handleRejections: true,
  exitOnError: false,
  silent: config.env === "test",
});

export default logger;
