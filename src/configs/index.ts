import dotenv from "dotenv";
import path from "path";

import type ms from "ms";

dotenv.config();

const config = {
  appName: process.env.APP_NAME || "Ecommerce Backend API",
  appVersion: process.env.APP_VERSION || "1.0.0",
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000"),
  debug: process.env.APP_DEBUG === "true",
  mongoUri: process.env.MONGO_URI!,
  dbName: process.env.DB_NAME,
  whitelistOrigins: ["www.example.com"],
  logLevel: process.env.LOG_LEVEL || "info",
  logDir: process.env.LOG_DIR || path.join(process.cwd(), "logs"),
  logMaxFiles: process.env.LOG_MAX_FILES || "14d",
  logMaxSize: process.env.LOG_MAX_SIZE || "20m",
  logDatePattern: process.env.LOG_DATE_PATTERN || "YYYY-MM-DD",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
};

export default config;
