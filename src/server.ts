// node modules
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { urlencoded } from "express";
import helmet from "helmet";
import "module-alias/register";

// types
import type { CorsOptions } from "cors";

// routes
import v1Routes from "@/routes/v1";

// custom modules
import config from "@/configs";
import { connectToDatabase, disconnectFromDatabase } from "@/configs/dbConfig";
import errorHandler from "@/middlewares/errorHandler";
import logger from "@/utils/logger";
import limiter from "@/utils/rateLimiter";

// Initialize Express app
const app = express();

// Configures CORS options
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // If no origin or origin is in whitelist, allow
    if (!origin || config.whitelistOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Error: ${origin} Not allowed by CORS`), false);
    }
  },
  credentials: true,
};

// Enable Cross-Origin Resource Sharing
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(urlencoded({ extended: true }));

// Parse cookies from incoming requests
app.use(cookieParser());

// Compress response bodies for all requests above 1KB
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  })
);

// Secure app by setting various HTTP headers
app.use(helmet());

// Use rate limiter
app.use(limiter);

// Global error handler middleware
app.use(errorHandler);

(async () => {
  try {
    //connect database
    await connectToDatabase();

    //routes
    app.use("/api/v1", v1Routes);

    // Start the server
    app.listen(config.port, () => {
      logger.info(`server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error("Failed to start the server", error);

    if (config.env === "production") {
      process.exit(1);
    }
  }
})();

// Graceful shutdown
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn("Server shutdown");
    process.exit(0);
  } catch (error) {
    logger.error("Error during server shutdown", error);
  }
};

process.on("SIGINT", handleServerShutdown);
process.on("SIGTERM", handleServerShutdown);
