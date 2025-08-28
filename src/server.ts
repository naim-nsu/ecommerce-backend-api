import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { urlencoded } from "express";
import helmet from "helmet";
import "module-alias/register";

import config from "@/configs";
import errorHandler from "@/middlewares/errorHandler";

// Initialize Express app
const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

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

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is alive");
});

// Global error handler middleware
app.use(errorHandler);

// Start the server
app.listen(config.PORT, () => {
  console.log(`server is running on port ${config.PORT}`);
});
