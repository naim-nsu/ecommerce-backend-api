import type { ConnectOptions } from "mongoose";
import mongoose from "mongoose";

import config from "@/configs";
import logger from "@/utils/logger";

const clientOptions: ConnectOptions = {
  dbName: config.dbName,
  appName: config.appName,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.mongoUri) {
    throw new Error("MongoDB URI is not defined in the configuration.");
  }

  try {
    await mongoose.connect(config.mongoUri, clientOptions);

    logger.info("Connected to the database successfully.", {
      uri: config.mongoUri,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    console.error("Error connecting to the database", err);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger.info("Disconnected from the database successfully.", {
      uri: config.mongoUri,
      options: clientOptions,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    logger.error("Error disconnecting from the database", err);
  }
};
